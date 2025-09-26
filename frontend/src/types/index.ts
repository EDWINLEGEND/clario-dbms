export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  bio?: string;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: User;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  lessons: Lesson[];
  enrollmentCount: number;
  rating: number;
  price: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  order: number;
  isCompleted?: boolean;
  resources: Resource[];
  quiz?: Quiz;
  courseId: string;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  courses: Course[];
  totalDuration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  enrollmentCount: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  technologies: string[];
  requirements: string[];
  deliverables: string[];
  category: string;
  isPublished: boolean;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
  attempts: number;
  lessonId: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'code' | 'image' | 'documentation';
  url: string;
  description?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: Date;
}

export interface Progress {
  userId: string;
  courseId?: string;
  trackId?: string;
  completedLessons: string[];
  currentLesson?: string;
  progressPercentage: number;
  timeSpent: number; // in minutes
  lastAccessed: Date;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  tags: string[];
  replies: Reply[];
  likes: number;
  isLiked?: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  likes: number;
  isLiked?: boolean;
  createdAt: Date;
  discussionId: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isVirtual: boolean;
  meetingUrl?: string;
  attendees: User[];
  maxAttendees?: number;
  category: string;
  isPublished: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
  userId: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  level?: string;
  duration?: [number, number];
  rating?: number;
  price?: [number, number];
  tags?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Video API types
export interface VideoSearchResult {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  compatibilityScore: number;
  tags: string[];
}

export interface VideoSearchResponse {
  query: string;
  items: VideoSearchResult[];
  metrics: {
    total: number;
    avgCompatibility: number;
  };
}

export interface VideoDetail {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  transcript: string | null;
  tags: string[];
}

// Video History interface for dashboard
export interface VideoHistory {
  id: string;
  videoId: string;
  percentWatched: number;
  watchedAt: string;
  updatedAt: string;
  video: {
    id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
  success: boolean;
}

export type VideoHistoryResponse = ApiResponse<VideoHistory[]>;