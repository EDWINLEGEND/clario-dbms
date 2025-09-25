// Project related types
export interface Project {
  id: string
  title: string
  description: string
  deadline: string
  createdAt: string
  updatedAt: string
  userId: string
  milestones: Milestone[]
  accountabilityFees: AccountabilityFee[]
}

export interface CreateProjectRequest {
  title: string
  description: string
  deadline: string
}

export interface UpdateProjectRequest {
  title?: string
  description?: string
  deadline?: string
}

// Milestone related types
export interface Milestone {
  id: string
  title: string
  description?: string
  dueDate: string
  status: MilestoneStatus
  createdAt: string
  updatedAt: string
  projectId: string
  reminders: Reminder[]
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export interface CreateMilestoneRequest {
  title: string
  description?: string
  dueDate: string
  projectId: string
}

export interface UpdateMilestoneRequest {
  title?: string
  description?: string
  dueDate?: string
  status?: MilestoneStatus
}

// Reminder related types
export interface Reminder {
  id: string
  milestoneId: string
  channel: ReminderChannel
  sendDate: string
  status: ReminderStatus
  createdAt: string
  updatedAt: string
  milestone: Milestone
}

export enum ReminderChannel {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
  PUSH = 'push'
}

export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED'
}

export interface CreateReminderRequest {
  milestoneId: string
  channel: ReminderChannel
  sendDate: string
}

// Accountability Fee related types
export interface AccountabilityFee {
  id: string
  amount: number
  status: FeeStatus
  createdAt: string
  updatedAt: string
  projectId: string
}

export enum FeeStatus {
  LOCKED = 'LOCKED',
  REFUNDED = 'REFUNDED',
  FORFEITED = 'FORFEITED'
}

export interface CreateAccountabilityFeeRequest {
  amount: number
  projectId: string
}

export interface UpdateAccountabilityFeeRequest {
  status: FeeStatus
}

// User related types
export interface User {
  id: string
  email: string
  name: string
  picture?: string
  learningTypeId?: string
  createdAt: string
  updatedAt: string
  learningType?: LearningType
  projects: Project[]
}

export interface LearningType {
  id: string
  name: string
  description?: string
}

// Video related types
export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  duration: string
  viewCount: number
  publishedAt: string
  channelTitle: string
  compatibilityScore?: number
}

export interface VideoSearchResponse {
  videos: Video[]
  totalResults: number
  averageCompatibility: number
}

export interface VideoSearchRequest {
  search_query: string
  maxResults?: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

// Form types
export interface ProjectFormData {
  title: string
  description: string
  deadline: string
}

export interface MilestoneFormData {
  title: string
  description?: string
  dueDate: string
}

export interface ReminderFormData {
  channel: ReminderChannel
  sendDate: string
}