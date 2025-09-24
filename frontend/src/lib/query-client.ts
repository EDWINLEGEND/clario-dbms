import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api';
import { CacheInvalidationManager, cacheWarmingStrategies, networkAwareCaching } from './cache-strategies';

// Global error handler for React Query
const globalErrorHandler = (error: unknown) => {
  if (error instanceof ApiError) {
    // Handle API errors globally
    console.error('API Error:', {
      status: error.status,
      message: error.message,
      details: error.details,
    });
    
    // Handle specific error cases
    if (error.status === 401) {
      // Redirect to login or refresh token
      window.location.href = '/auth';
    } else if (error.status === 403) {
      // Show permission denied message
      console.error('Permission denied');
    } else if (error.status >= 500) {
      // Show server error message
      console.error('Server error occurred');
    }
  } else {
    console.error('Unexpected error:', error);
  }
};

// Default query function that can be used across the app
const defaultQueryFn = async ({ queryKey }: { queryKey: any[] }) => {
  // This is a fallback - in practice, each query should have its own queryFn
  throw new Error(`No query function found for query key: ${queryKey.join(' -> ')}`);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Remove the default query function to prevent conflicts
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // Apply network-aware caching by default
      ...networkAwareCaching.getNetworkAwareOptions(),
    },
    mutations: {
      onError: globalErrorHandler,
      retry: (failureCount, error) => {
        // Don't retry mutations on client errors
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Initialize cache management utilities
export const cacheManager = new CacheInvalidationManager(queryClient);

// Warm up cache on app initialization
export const initializeCache = async () => {
  try {
    await cacheWarmingStrategies.warmEssentialData(queryClient);
  } catch (error) {
    console.warn('Failed to warm cache:', error);
  }
};

// Periodic cache cleanup (run every hour)
setInterval(() => {
  cacheManager.performCacheCleanup();
}, 60 * 60 * 1000);

// Query key factory for consistent key generation
export const queryKeys = {
  // Videos
  videos: {
    all: () => ['videos'] as const,
    lists: () => [...queryKeys.videos.all(), 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.videos.lists(), filters] as const,
    details: () => [...queryKeys.videos.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.videos.details(), id] as const,
    search: (query: string) => [...queryKeys.videos.all(), 'search', query] as const,
  },
  
  // Projects
  projects: {
    all: () => ['projects'] as const,
    lists: () => [...queryKeys.projects.all(), 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
  
  // Authentication
  auth: {
    all: () => ['auth'] as const,
    user: () => [...queryKeys.auth.all(), 'user'] as const,
    profile: () => [...queryKeys.auth.all(), 'profile'] as const,
  },
  
  // Learning keys
  learning: {
    all: () => ['learning'] as const,
    courses: () => [...queryKeys.learning.all(), 'courses'] as const,
    course: (id: string) => [...queryKeys.learning.courses(), id] as const,
    lessons: () => [...queryKeys.learning.all(), 'lessons'] as const,
    lesson: (courseId: string, lessonId: string) => [...queryKeys.learning.lessons(), courseId, lessonId] as const,
  },
  
  // Cache management
  cache: {
    backgroundSync: () => ['background-sync'] as const,
    healthCheck: () => ['health-check'] as const,
  },
} as const;

// Data revalidation policies
export const revalidationPolicies = {
  // Revalidate projects when user performs actions
  onProjectAction: () => {
    cacheManager.invalidateRelatedQueries('project');
  },
  
  // Revalidate user data when auth state changes
  onAuthChange: () => {
    cacheManager.invalidateRelatedQueries('user');
  },
  
  // Smart revalidation based on data staleness
  smartRevalidation: (entityType: string, lastUpdated: number) => {
    const now = Date.now();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes
    
    if (now - lastUpdated > staleThreshold) {
      cacheManager.invalidateRelatedQueries(entityType);
    }
  },
};

// Export utilities for use in components
export { cacheWarmingStrategies, networkAwareCaching };