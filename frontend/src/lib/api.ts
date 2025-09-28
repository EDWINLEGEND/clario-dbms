import { VideoSearchResponse, VideoDetail } from "@/types";

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Enhanced API client class
export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { accessToken?: string } = {}
  ): Promise<T> {
    const { accessToken, ...fetchOptions } = options;
    
    // Construct full URL
    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle different response statuses
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorDetails = errorData;
        } catch {
          // If response is not JSON, use status text
        }

        // Map specific status codes to user-friendly messages
        switch (response.status) {
          case 401:
            throw new ApiError('Please sign in to access video search', 401, 'UNAUTHORIZED', errorDetails);
          case 403:
            throw new ApiError('You do not have permission to access this resource', 403, 'FORBIDDEN', errorDetails);
          case 404:
            throw new ApiError('The requested resource was not found', 404, 'NOT_FOUND', errorDetails);
          case 429:
            throw new ApiError('Too many requests. Please try again later', 429, 'RATE_LIMITED', errorDetails);
          case 500:
            throw new ApiError('Server error. Please try again later', 500, 'SERVER_ERROR', errorDetails);
          default:
            throw new ApiError(errorMessage, response.status, 'API_ERROR', errorDetails);
        }
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408, 'TIMEOUT');
        }
        throw new ApiError(`Network error: ${error.message}`, 0, 'NETWORK_ERROR');
      }
      
      throw new ApiError('An unexpected error occurred', 0, 'UNKNOWN_ERROR');
    }
  }

  // GET request
  async get<T>(endpoint: string, accessToken?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', accessToken });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, accessToken?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      accessToken,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, accessToken?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      accessToken,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, accessToken?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', accessToken });
  }
}

// Create singleton API client instance
export const apiClient = new ApiClient();

// Legacy API request function for backward compatibility
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { accessToken?: string } = {}
): Promise<T> {
  const { accessToken, ...fetchOptions } = options;
  return apiClient.get<T>(endpoint, accessToken);
}

// Video API functions using the new client
export const videoApi = {
  searchVideos: async (searchQuery: string, accessToken?: string) => {
    if (!searchQuery?.trim()) {
      throw new ApiError('Search query is required', 400, 'VALIDATION_ERROR');
    }
    
    const params = new URLSearchParams({ search_query: searchQuery.trim() });
    return apiClient.get(`/videos?${params}`, accessToken);
  },

  getVideoDetail: async (videoId: string, accessToken?: string) => {
    if (!videoId?.trim()) {
      throw new ApiError('Video ID is required', 400, 'VALIDATION_ERROR');
    }
    
    return apiClient.get(`/videos/${encodeURIComponent(videoId)}`, accessToken);
  },
};

// Project API functions
export const projectApi = {
  getProjects: async (accessToken?: string) => {
    return apiClient.get('/projects', accessToken);
  },

  getProject: async (projectId: string, accessToken?: string) => {
    if (!projectId?.trim()) {
      throw new ApiError('Project ID is required', 400, 'VALIDATION_ERROR');
    }
    
    return apiClient.get(`/projects/${encodeURIComponent(projectId)}`, accessToken);
  },

  createProject: async (projectData: any, accessToken?: string) => {
    return apiClient.post('/projects', projectData, accessToken);
  },

  updateProject: async (projectId: string, projectData: any, accessToken?: string) => {
    if (!projectId?.trim()) {
      throw new ApiError('Project ID is required', 400, 'VALIDATION_ERROR');
    }
    
    return apiClient.put(`/projects/${encodeURIComponent(projectId)}`, projectData, accessToken);
  },

  deleteProject: async (projectId: string, accessToken?: string) => {
    if (!projectId?.trim()) {
      throw new ApiError('Project ID is required', 400, 'VALIDATION_ERROR');
    }
    
    return apiClient.delete(`/projects/${encodeURIComponent(projectId)}`, accessToken);
  },
};

// Course API functions
export const courseApi = {
  getCourses: async (accessToken?: string) => {
    return apiClient.get('/courses', accessToken);
  },

  getCourseDetail: async (courseId: string, accessToken?: string) => {
    if (!courseId?.trim()) {
      throw new ApiError('Course ID is required', 400, 'VALIDATION_ERROR');
    }
    
    return apiClient.get(`/courses/${encodeURIComponent(courseId)}`, accessToken);
  },

  markLessonComplete: async (courseId: string, lessonId: string, accessToken?: string) => {
    if (!courseId?.trim()) {
      throw new ApiError('Course ID is required', 400, 'VALIDATION_ERROR');
    }
    if (!lessonId?.trim()) {
      throw new ApiError('Lesson ID is required', 400, 'VALIDATION_ERROR');
    }
    
    return apiClient.post(`/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/complete`, {}, accessToken);
  },
};

// Authentication API functions
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return apiClient.post('/auth/login', credentials);
  },

  register: async (userData: { email: string; password: string; name: string }) => {
    return apiClient.post('/auth/register', userData);
  },

  refreshToken: async (refreshToken: string) => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  logout: async (accessToken?: string) => {
    return apiClient.post('/auth/logout', {}, accessToken);
  },

  getProfile: async (accessToken?: string) => {
    return apiClient.get('/auth/profile', accessToken);
  },
};

// Utility functions
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = API_CONFIG.retryAttempts,
  delay: number = API_CONFIG.retryDelay
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except for 408 (timeout) and 429 (rate limit)
      if (error instanceof ApiError) {
        const shouldRetry = error.status === 408 || error.status === 429 || error.status >= 500;
        if (!shouldRetry || attempt === maxRetries) {
          throw error;
        }
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
}