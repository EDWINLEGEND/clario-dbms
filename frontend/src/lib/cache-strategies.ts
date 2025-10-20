import { QueryClient } from '@tanstack/react-query';

// Cache time constants (in milliseconds)
export const CACHE_TIMES = {
  // Static content that rarely changes
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },
  
  // Semi-static content (videos, courses)
  SEMI_STATIC: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  
  // Dynamic content (projects, user data)
  DYNAMIC: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  },
  
  // Real-time content (notifications, live data)
  REALTIME: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Search results (short-lived)
  SEARCH: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
} as const;

// Revalidation strategies
export const REVALIDATION_STRATEGIES = {
  // Background revalidation for critical data
  BACKGROUND_REFETCH: {
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: false,
  },
  
  // On focus revalidation for user-facing data
  ON_FOCUS: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
  
  // No automatic revalidation for static content
  STATIC_ONLY: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  },
  
  // Aggressive revalidation for critical real-time data
  AGGRESSIVE: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60 * 1000, // 1 minute
    refetchIntervalInBackground: true,
  },
} as const;

// Cache invalidation patterns
export class CacheInvalidationManager {
  constructor(private queryClient: QueryClient) {}

  // Invalidate related queries when data changes
  invalidateRelatedQueries(entityType: string, entityId?: string) {
    switch (entityType) {
      case 'project':
        this.queryClient.invalidateQueries({ queryKey: ['projects'] });
        if (entityId) {
          this.queryClient.invalidateQueries({ queryKey: ['projects', entityId] });
        }
        break;
        
      case 'video':
        this.queryClient.invalidateQueries({ queryKey: ['videos'] });
        if (entityId) {
          this.queryClient.invalidateQueries({ queryKey: ['videos', entityId] });
        }
        break;
        
      case 'user':
        this.queryClient.invalidateQueries({ queryKey: ['auth'] });
        // User changes might affect projects and other user-specific data
        this.queryClient.invalidateQueries({ queryKey: ['projects'] });
        break;
        
      default:
        console.warn(`Unknown entity type for cache invalidation: ${entityType}`);
    }
  }

  // Smart cache cleanup - remove stale data beyond certain thresholds
  performCacheCleanup() {
    const now = Date.now();
    const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
    
    // Get all queries from cache
    const queryCache = this.queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    queries.forEach(query => {
      const lastUpdated = query.state.dataUpdatedAt;
      if (now - lastUpdated > maxCacheAge) {
        queryCache.remove(query);
      }
    });
  }

  // Prefetch related data based on user behavior
  prefetchRelatedData(entityType: string, entityId: string) {
    switch (entityType) {
      case 'project':
        // When viewing a project, prefetch related videos or team data
        this.queryClient.prefetchQuery({
          queryKey: ['videos', 'by-project', entityId],
          queryFn: () => {}, // Would be implemented with actual API call
          staleTime: CACHE_TIMES.SEMI_STATIC.staleTime,
        });
        break;
        
      case 'video':
        // When viewing a video, prefetch related videos or course data
        this.queryClient.prefetchQuery({
          queryKey: ['videos', 'related', entityId],
          queryFn: () => {}, // Would be implemented with actual API call
          staleTime: CACHE_TIMES.SEMI_STATIC.staleTime,
        });
        break;
    }
  }
}

// Optimistic update helpers
export const optimisticUpdateHelpers = {
  // Update project in cache optimistically
  updateProjectOptimistically: (queryClient: QueryClient, projectId: string, updates: any) => {
    queryClient.setQueryData(['projects', projectId], (oldData: any) => ({
      ...oldData,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    
    // Also update in projects list
    queryClient.setQueryData(['projects'], (oldProjects: any[] | undefined) => {
      if (!oldProjects) return oldProjects;
      return oldProjects.map(project => 
        project.id === projectId ? { ...project, ...updates } : project
      );
    });
  },

  // Add new project optimistically
  addProjectOptimistically: (queryClient: QueryClient, newProject: any) => {
    queryClient.setQueryData(['projects'], (oldProjects: any[] | undefined) => {
      const projects = oldProjects || [];
      return [newProject, ...projects];
    });
  },

  // Remove project optimistically
  removeProjectOptimistically: (queryClient: QueryClient, projectId: string) => {
    queryClient.setQueryData(['projects'], (oldProjects: any[] | undefined) => {
      if (!oldProjects) return oldProjects;
      return oldProjects.filter(project => project.id !== projectId);
    });
    
    // Remove individual project cache
    queryClient.removeQueries({ queryKey: ['projects', projectId] });
  },
};

// Network-aware caching
export const networkAwareCaching = {
  // Adjust cache behavior based on network conditions
  getNetworkAwareOptions: () => {
    // In a real app, you'd detect network conditions
    const isSlowNetwork = false; // navigator.connection?.effectiveType === '2g'
    const isOffline = !navigator.onLine;
    
    if (isOffline) {
      return {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: Infinity, // Use cached data indefinitely when offline
      };
    }
    
    if (isSlowNetwork) {
      return {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: CACHE_TIMES.STATIC.staleTime, // Longer stale time on slow networks
      };
    }
    
    return {}; // Default behavior for good networks
  },
};

// Cache warming strategies
export const cacheWarmingStrategies = {
  // Warm up cache with essential data on app start
  warmEssentialData: async (queryClient: QueryClient) => {
    const essentialQueries = [
      { 
        queryKey: ['auth', 'user'], 
        priority: 'high',
        queryFn: () => Promise.resolve(null) // No user initially
      },
      { 
        queryKey: ['projects'], 
        priority: 'high',
        queryFn: () => Promise.resolve([]) // Empty projects array
      },
      { 
        queryKey: ['videos'], 
        priority: 'medium',
        queryFn: () => Promise.resolve([]) // Empty videos array
      },
    ];
    
    // Prefetch high priority queries immediately
    const highPriorityQueries = essentialQueries
      .filter(q => q.priority === 'high')
      .map(q => queryClient.prefetchQuery({ 
        queryKey: q.queryKey, 
        queryFn: q.queryFn 
      }));
    
    await Promise.all(highPriorityQueries);
    
    // Prefetch medium priority queries after a delay
    setTimeout(() => {
      essentialQueries
        .filter(q => q.priority === 'medium')
        .forEach(q => queryClient.prefetchQuery({ 
          queryKey: q.queryKey, 
          queryFn: q.queryFn 
        }));
    }, 1000);
  },
  
  // Warm cache based on user navigation patterns
  warmBasedOnUserBehavior: (queryClient: QueryClient, userBehavior: any) => {
    // Example: If user frequently visits projects, prefetch project data
    if (userBehavior.frequentlyVisitsProjects) {
      queryClient.prefetchQuery({
        queryKey: ['projects'],
        queryFn: () => {}, // Actual API call
        staleTime: CACHE_TIMES.DYNAMIC.staleTime,
      });
    }
  },
};

// Export a factory function to create cache strategies
export const createCacheStrategy = (type: keyof typeof CACHE_TIMES, revalidation: keyof typeof REVALIDATION_STRATEGIES = 'ON_FOCUS') => ({
  ...CACHE_TIMES[type],
  ...REVALIDATION_STRATEGIES[revalidation],
  ...networkAwareCaching.getNetworkAwareOptions(),
});