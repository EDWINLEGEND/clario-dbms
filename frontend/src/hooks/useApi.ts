import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';

// Types
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  category?: string;
  level?: string;
  rating?: string;
  instructor?: string;
  students?: string;
  lessons?: Array<{
    id: string;
    title: string;
    duration: string;
    completed: boolean;
  }>;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  tags: string[];
  teamMembers: number;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    instructor: {
      id: string;
      name: string;
    };
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Video Hooks
export function useVideos(query?: string, options?: Partial<UseQueryOptions<Video[], Error>>) {
  return useQuery({
    queryKey: query ? queryKeys.videos.search(query) : queryKeys.videos.all(),
    queryFn: async (): Promise<Video[]> => {
      try {
        const token = localStorage.getItem('auth_token');
        if (query) {
          const response = await apiClient.get(`/videos?search_query=${encodeURIComponent(query)}`, token || undefined);
          return response as Video[];
        } else {
          const response = await apiClient.get('/videos', token || undefined);
          return response as Video[];
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        throw error; // Re-throw the error so React Query can handle it
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    ...options,
  });
}

export function useVideoDetails(id: string, options?: Partial<UseQueryOptions<Video, Error>>) {
  return useQuery({
    queryKey: queryKeys.videos.detail(id),
    queryFn: async (): Promise<Video> => {
      // Try to get from backend, fallback to mock data
      try {
        const token = localStorage.getItem('auth_token');
        const response = await apiClient.get(`/videos/${id}`, token || undefined);
        return response as Video;
      } catch (error) {
        // Return mock data as fallback
        const mockVideo: Video = {
          id,
          title: 'Sample Video',
          description: 'This is a sample video description',
          duration: '5:00',
          thumbnail: 'https://example.com/thumbnail.jpg',
        };
        return mockVideo;
      }
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes - video details are relatively static
    gcTime: 60 * 60 * 1000, // 1 hour cache
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useVideoSearch(query: string, options?: Partial<UseQueryOptions<Video[], Error>>) {
  return useQuery({
    queryKey: [...queryKeys.videos.lists(), 'search', query],
    queryFn: async (): Promise<Video[]> => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await apiClient.get(`/videos?search_query=${encodeURIComponent(query)}`, token || undefined);
        return response as Video[];
      } catch (error) {
        // Return empty array as fallback
        return [];
      }
    },
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes - search results can be cached briefly
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    ...options,
  });
}

// Project Hooks
export function useProjects(options?: Partial<UseQueryOptions<Project[], Error>>) {
  return useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: async (): Promise<Project[]> => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await apiClient.get('/projects', token || undefined);
        return response as Project[];
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        throw error; // Re-throw the error so React Query can handle it
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - projects change more frequently
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    refetchOnWindowFocus: true, // Refetch on focus for fresh project data
    ...options,
  });
}

export function useProjectDetails(id: string, options?: Partial<UseQueryOptions<Project, Error>>) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: async (): Promise<Project> => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await apiClient.get(`/projects/${id}`, token || undefined);
        return response as Project;
      } catch (error) {
        // Return mock data as fallback
        const mockProject: Project = {
          id,
          title: 'Sample Project',
          description: 'This is a sample project description',
          status: 'active',
          priority: 'medium',
          dueDate: '2024-03-30',
          progress: 50,
          tags: ['JavaScript', 'CSS'],
          teamMembers: 3,
          createdAt: '2024-01-12T08:00:00Z',
          updatedAt: '2024-01-19T12:00:00Z',
        };
        return mockProject;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    ...options,
  });
}

export function useCreateProject(options?: UseMutationOptions<Project, Error, Partial<Project>>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: Partial<Project>): Promise<Project> => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await apiClient.post('/projects', projectData, token || undefined);
        return response as Project;
      } catch (error) {
        // For demo purposes, return mock created project
        const mockProject: Project = {
          id: Date.now().toString(),
          title: projectData.title || 'New Project',
          description: projectData.description || 'Project description',
          status: 'active',
          priority: 'medium',
          dueDate: '2024-04-01',
          progress: 0,
          tags: [],
          teamMembers: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return mockProject;
      }
    },
    onSuccess: (newProject) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      
      // Optimistically add the new project to the cache
      queryClient.setQueryData(queryKeys.projects.detail(newProject.id), newProject);
    },
    ...options,
  });
}

export function useUpdateProject(options?: UseMutationOptions<Project, Error, { id: string; data: Partial<Project> }>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }): Promise<Project> => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await apiClient.put(`/projects/${id}`, data, token || undefined);
        return response as Project;
      } catch (error) {
        // For demo purposes, return mock updated project
        const mockProject: Project = {
          id,
          title: data.title || 'Updated Project',
          description: data.description || 'Updated description',
          status: data.status || 'active',
          priority: data.priority || 'medium',
          dueDate: data.dueDate || '2024-04-01',
          progress: data.progress || 50,
          tags: data.tags || [],
          teamMembers: data.teamMembers || 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString(),
        };
        return mockProject;
      }
    },
    onSuccess: (updatedProject, { id }) => {
      // Update the specific project in cache
      queryClient.setQueryData(queryKeys.projects.detail(id), updatedProject);
      
      // Update the project in the projects list
      queryClient.setQueryData(queryKeys.projects.all(), (oldProjects: Project[] | undefined) => {
        if (!oldProjects) return [updatedProject];
        return oldProjects.map(project => 
          project.id === id ? updatedProject : project
        );
      });
    },
    ...options,
  });
}

export function useDeleteProject(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const token = localStorage.getItem('auth_token');
        await apiClient.delete(`/projects/${id}`, token || undefined);
      } catch (error) {
        // For demo purposes, just proceed with deletion
        console.log('Mock deletion of project:', id);
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove from projects list
      queryClient.setQueryData(queryKeys.projects.all(), (oldProjects: Project[] | undefined) => {
        if (!oldProjects) return [];
        return oldProjects.filter(project => project.id !== deletedId);
      });
      
      // Remove the specific project from cache
      queryClient.removeQueries({ queryKey: queryKeys.projects.detail(deletedId) });
    },
    ...options,
  });
}

// Authentication Hooks
export function useCurrentUser(options?: Partial<UseQueryOptions<User | null, Error>>) {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async (): Promise<User | null> => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          // Return null for unauthenticated users instead of undefined
          return null;
        }
        const response = await apiClient.get('/auth/profile', token);
        return response as User;
      } catch (error) {
        // Return null for failed authentication instead of undefined
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
}

export function useLogin(options?: UseMutationOptions<{ user: User; token: string }, Error, { email: string; password: string }>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }): Promise<{ user: User; token: string }> => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await apiClient.post('/auth/login', { email, password }, token || undefined);
        return response as { user: User; token: string };
      } catch (error) {
        // For demo purposes, return mock login response
        const mockResponse = {
          user: {
            id: '1',
            email,
            name: 'Demo User',
            avatar: 'https://example.com/avatar.jpg',
          },
          token: 'mock-jwt-token-' + Date.now(),
        };
        return mockResponse;
      }
    },
    onSuccess: ({ user, token }) => {
      // Store token and update user cache
      localStorage.setItem('auth_token', token);
      queryClient.setQueryData(queryKeys.auth.user(), user);
    },
    ...options,
  });
}

export function useLogout(options?: UseMutationOptions<void, Error, void>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        const token = localStorage.getItem('auth_token');
        await apiClient.post('/auth/logout', {}, token || undefined);
      } catch (error) {
        // For demo purposes, just proceed with logout
        console.log('Mock logout');
      }
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Remove token
      localStorage.removeItem('auth_token');
    },
    ...options,
  });
}

// Utility Hooks
export function usePrefetchVideo(id: string) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.videos.detail(id),
      queryFn: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          return await apiClient.get(`/videos/${id}`, token || undefined);
        } catch (error) {
          console.error(`Failed to prefetch video ${id}:`, error);
          throw error; // Re-throw the error so React Query can handle it
        }
      },
      staleTime: 15 * 60 * 1000,
    });
  };
}

export function usePrefetchProject(id: string) {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.projects.detail(id),
      queryFn: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          return await apiClient.get(`/projects/${id}`, token || undefined);
        } catch (error) {
          // Return mock data as fallback
          return {
            id,
            title: 'Sample Project',
            description: 'This is a sample project description',
            status: 'active',
            priority: 'medium',
            dueDate: '2024-03-30',
            progress: 50,
            tags: ['JavaScript', 'CSS'],
            teamMembers: 3,
          };
        }
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateVideos: () => queryClient.invalidateQueries({ queryKey: queryKeys.videos.all() }),
    invalidateProjects: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() }),
    invalidateAuth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
}

// Background refetch hooks for real-time updates
export function useBackgroundSync() {
  const queryClient = useQueryClient();
  
  // Refetch critical data every 5 minutes when the app is active
  return useQuery({
    queryKey: ['background-sync'],
    queryFn: async () => {
      // Refetch projects (most likely to change)
      await queryClient.refetchQueries({ queryKey: queryKeys.projects.all() });
      
      // Refetch user data
      await queryClient.refetchQueries({ queryKey: queryKeys.auth.user() });
      
      return null;
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: false,
    enabled: false, // Only enable when needed
  });
}