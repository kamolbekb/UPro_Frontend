# Data Model: TypeScript Interfaces

**Feature**: UPro Frontend Application
**Date**: 2026-03-10
**Status**: Complete

## Overview

This document defines all TypeScript interfaces used throughout the frontend application. Interfaces are organized by domain entity and include API DTOs, form data types, and UI state types.

---

## Core Entities

### User

```typescript
/**
 * Represents an authenticated user in the system
 */
export interface User {
  id: string; // UUID
  phoneNumber: string; // E.164 format: +998901234567
  firstName: string | null;
  lastName: string | null;
  image: string | null; // Full image URL from backend
  birthDate: string | null; // ISO 8601: 2000-01-15
  email: string | null;
  isExecutor: boolean; // True if user has executor profile
  createdAt: string; // ISO 8601 timestamp
}

/**
 * User data returned after successful authentication
 */
export interface AuthenticatedUser extends User {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: string; // ISO 8601 timestamp
}
```

---

### Task (OrderTask)

```typescript
/**
 * Represents a freelance task/order in the marketplace
 */
export interface Task {
  id: string; // UUID
  title: string;
  description: string;
  categoryId: string; // UUID
  categoryName: string; // Display name (e.g., "Web Development")
  subCategoryId: string | null;
  subCategoryName: string | null;
  budgetTypeId: string; // UUID
  budgetTypeName: string; // "Fixed" | "Hourly"
  budgetAmount: number; // In local currency (UZS)
  serviceLocationId: string; // District UUID
  regionName: string; // "Tashkent" | "Samarkand" etc.
  districtName: string; // "Yunusabad" etc.
  images: string[]; // Array of image URLs
  status: TaskStatus;
  applicationCount: number; // Number of executor applications
  isBookmarked: boolean; // True if current user bookmarked this task
  createdBy: string; // User ID of task creator
  createdAt: string; // ISO 8601
  modifiedAt: string | null; // ISO 8601
}

export enum TaskStatus {
  Draft = 0,
  Published = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

/**
 * Task with client details (for task detail view)
 */
export interface TaskDetail extends Task {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    rating: number | null; // Average rating (0-5)
    completedTasks: number; // Number of tasks client has completed
  };
  applications: TaskApplication[]; // List of executor applications
}
```

---

### Executor Profile

```typescript
/**
 * Executor professional profile
 */
export interface ExecutorProfile {
  id: string; // UUID
  userId: string; // Associated user ID
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
    phoneNumber: string;
  };
  serviceLocationId: string; // District UUID where executor provides services
  serviceFields: ServiceField[]; // Categories/skills executor offers
  workExperience: WorkExperience[];
  education: Education[];
  languages: LanguageProficiency[];
  rating: number | null; // Average rating (0-5)
  completedTasks: number; // Number of tasks completed as executor
  isApproved: boolean; // True if admin approved executor profile
  createdAt: string;
}

export interface ServiceField {
  categoryId: string;
  categoryName: string;
  subCategoryId: string | null;
  subCategoryName: string | null;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string; // Format: "MM.YYYY" (e.g., "01.2020")
  endDate: string | null; // null means currently working
  details: string | null; // Description of responsibilities
}

export interface Education {
  id: string;
  schoolName: string;
  educationTypeId: string; // UUID
  educationTypeName: string; // "Bachelor's" | "Master's" etc.
  fieldOfStudy: string;
  startDate: string; // Format: "MM.YYYY"
  endDate: string | null; // null means currently studying
  details: string | null;
}

export interface LanguageProficiency {
  id: string;
  languageId: string; // UUID
  languageName: string; // "English" | "Russian" etc.
  proficiencyLevel: LanguageLevel;
}

export enum LanguageLevel {
  Elementary = 1,
  Advanced = 2,
  Professional = 3,
  Proficient = 4,
  Native = 5,
}
```

---

### Task Application

```typescript
/**
 * Executor application to a task
 */
export interface TaskApplication {
  id: string; // UUID
  taskId: string;
  executorId: string;
  executor: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    rating: number | null;
    completedTasks: number;
  };
  proposedBudget: number; // Executor's proposed price
  coverLetter: string; // Why executor is qualified
  estimatedDuration: string | null; // "3 days" | "1 week" etc.
  status: ApplicationStatus;
  createdAt: string;
}

export enum ApplicationStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Withdrawn = 3,
}
```

---

### Chat

```typescript
/**
 * Chat conversation between client and executor
 */
export interface Conversation {
  id: string; // UUID
  applicationId: string; // Associated task application
  taskId: string;
  taskTitle: string;
  participantId: string; // Other user's ID (not current user)
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    isOnline: boolean;
  };
  lastMessage: Message | null;
  unreadCount: number; // Number of unread messages for current user
  createdAt: string;
  updatedAt: string; // Last message timestamp
}

/**
 * Individual chat message
 */
export interface Message {
  id: string; // UUID
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string; // Message text
  attachments: MessageAttachment[];
  isRead: boolean; // True if recipient has read the message
  sentAt: string; // ISO 8601
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string; // URL to download file
  fileSize: number; // In bytes
  mimeType: string; // "image/jpeg" | "application/pdf" etc.
}

/**
 * Real-time typing indicator state
 */
export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}
```

---

### Notification

```typescript
/**
 * System notification for user
 */
export interface Notification {
  id: string; // UUID
  userId: string;
  type: NotificationType;
  title: string; // Short notification title
  body: string; // Notification message
  entityType: string | null; // "Task" | "Application" | "Message"
  entityId: string | null; // UUID of related entity
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  TaskCreated = 'TaskCreated',
  TaskAssigned = 'TaskAssigned',
  TaskCompleted = 'TaskCompleted',
  TaskCancelled = 'TaskCancelled',
  ExecutorApproved = 'ExecutorApproved',
  ExecutorRejected = 'ExecutorRejected',
  MessageReceived = 'MessageReceived',
  ApplicationSubmitted = 'ApplicationSubmitted',
  ApplicationAccepted = 'ApplicationAccepted',
  ApplicationRejected = 'ApplicationRejected',
  SystemAnnouncement = 'SystemAnnouncement',
}
```

---

### Category & Location

```typescript
/**
 * Service category (hierarchical)
 */
export interface Category {
  id: string; // UUID
  name: string; // English name
  nameUz: string | null; // Uzbek translation
  nameRu: string | null; // Russian translation
  icon: string | null; // Icon name/URL
  parentId: string | null; // null for root categories
  subCategories: Category[]; // Nested sub-categories
  hint: string | null; // Help text for users
}

/**
 * Geographic region (Tashkent, Samarkand, etc.)
 */
export interface Region {
  id: string; // UUID
  name: string;
  nameUz: string | null;
  nameRu: string | null;
  districts: District[];
}

/**
 * District within a region
 */
export interface District {
  id: string; // UUID
  name: string;
  nameUz: string | null;
  nameRu: string | null;
  regionId: string;
}

/**
 * Budget type classification
 */
export interface BudgetType {
  id: string; // UUID
  name: string; // "Fixed Price" | "Hourly Rate"
  description: string | null;
}

/**
 * Education type classification
 */
export interface EducationType {
  id: string; // UUID
  name: string; // "High School" | "Bachelor's" | "Master's" etc.
}

/**
 * Language with search support
 */
export interface Language {
  id: string; // UUID
  name: string; // "English"
  nativeName: string; // "English" (same or localized)
  code: string; // ISO 639-1: "en"
}
```

---

## API Request/Response DTOs

### Authentication

```typescript
/**
 * Phone login request
 */
export interface SendOtpRequest {
  phoneNumber: string; // E.164 format: +998901234567
}

export interface SendOtpResponse {
  message: string; // "OTP sent successfully"
  expiresIn: number; // Seconds until OTP expires (300 = 5 minutes)
}

/**
 * OTP verification request
 */
export interface VerifyOtpRequest {
  phoneNumber: string;
  code: string; // 6-digit code
}

export interface VerifyOtpResponse {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Seconds until access token expires
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string; // New refresh token (rotation)
  expiresIn: number;
}
```

---

### Tasks

```typescript
/**
 * Create new task request
 */
export interface CreateTaskRequest {
  title: string; // Min 5 chars
  description: string; // Min 20 chars
  categoryId: string; // UUID
  subCategoryId: string | null; // UUID, optional
  budgetTypeId: string; // UUID
  budgetAmount: number; // Positive number
  serviceLocationId: string; // District UUID
  images: File[]; // Max 5 files, max 5MB each, JPEG/PNG/GIF/WEBP
  extraFields: Record<string, string>; // Custom fields per category
}

export interface CreateTaskResponse {
  task: TaskDetail;
}

/**
 * Task search/filter request
 */
export interface TaskFilters {
  searchTerm?: string; // Keyword search
  categoryId?: string; // Filter by category
  subCategoryId?: string; // Filter by sub-category
  regionId?: string; // Filter by region
  districtId?: string; // Filter by district
  budgetTypeId?: string; // Filter by budget type
  minBudget?: number; // Minimum budget
  maxBudget?: number; // Maximum budget
  status?: TaskStatus; // Filter by status
  page: number; // 1-indexed
  pageSize: number; // Default 20
}

export interface TaskListResponse {
  items: Task[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

### Executor

```typescript
/**
 * Become executor request
 */
export interface BecomeExecutorRequest {
  firstName: string;
  lastName: string;
  birthDate: string; // ISO 8601: 2000-01-15
  image: File | null; // Profile image
  serviceLocationId: string; // District UUID
  serviceFields: Array<{
    categoryId: string;
    subCategoryId: string | null;
  }>;
  workExperience: Array<{
    companyName: string;
    position: string;
    startDate: string; // "MM.YYYY"
    endDate: string | null; // null = currently working
    details: string | null;
  }>;
  education: Array<{
    schoolName: string;
    educationTypeId: string;
    fieldOfStudy: string;
    startDate: string; // "MM.YYYY"
    endDate: string | null; // null = currently studying
    details: string | null;
  }>;
  languages: Array<{
    languageId: string;
    proficiencyLevel: LanguageLevel;
  }>;
}

export interface BecomeExecutorResponse {
  executor: ExecutorProfile;
}
```

---

### Chat

```typescript
/**
 * Get or create conversation request
 */
export interface GetOrCreateConversationRequest {
  applicationId: string; // UUID
}

export interface GetOrCreateConversationResponse {
  conversation: Conversation;
}

/**
 * Send message request (via SignalR)
 */
export interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachments: File[];
}

export interface SendMessageResponse {
  message: Message;
}
```

---

## Form Data Types

### Task Creation Form

```typescript
/**
 * Task creation form data (before file upload transformation)
 */
export interface TaskFormData {
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  budgetTypeId: string;
  budgetAmount: string; // String in form, converted to number
  serviceLocationId: string;
  images: FileList | null; // Browser FileList object
  extraFields: Record<string, string>;
}
```

### Executor Profile Form

```typescript
/**
 * Executor profile form data
 */
export interface ExecutorFormData {
  firstName: string;
  lastName: string;
  birthDate: string; // Date input value
  image: FileList | null;
  serviceLocationId: string;
  serviceFields: Array<{
    categoryId: string;
    subCategoryId: string;
  }>;
  workExperience: Array<{
    id: string; // Temporary ID for React key
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    isCurrentlyWorking: boolean; // Checkbox state
    details: string;
  }>;
  education: Array<{
    id: string;
    schoolName: string;
    educationTypeId: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    isCurrentlyStudying: boolean;
    details: string;
  }>;
  languages: Array<{
    id: string;
    languageId: string;
    proficiencyLevel: string; // Select value
  }>;
}
```

---

## UI State Types

### Auth State (Zustand)

```typescript
/**
 * Client-side auth state
 */
export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}
```

### Filter State

```typescript
/**
 * Task filter UI state
 */
export interface TaskFilterState {
  searchTerm: string;
  categoryId: string;
  regionId: string;
  budgetRange: [number, number]; // Min, Max
  sortBy: 'newest' | 'budget-asc' | 'budget-desc';
}
```

---

## API Response Wrapper

### ApiResult Pattern

```typescript
/**
 * Standard API response wrapper from backend
 */
export interface ApiResult<T> {
  succeeded: boolean;
  result: T;
  errors: string[];
  message: string | null;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

## Utility Types

### Common

```typescript
/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Extract non-nullable type
 */
export type NonNullable<T> = Exclude<T, null | undefined>;

/**
 * ID type for better semantics
 */
export type UUID = string;

/**
 * ISO 8601 timestamp string
 */
export type ISODateString = string;
```

---

## Type Guards

### Validation Helpers

```typescript
/**
 * Check if value is a valid UUID
 */
export function isUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Check if value is a valid phone number (E.164)
 */
export function isPhoneNumber(value: string): boolean {
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(value);
}

/**
 * Check if value is a valid ISO 8601 date
 */
export function isISODate(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString();
}
```

---

## Summary

**Total Interfaces Defined**: 40+
**Total Enums Defined**: 4

All TypeScript interfaces are complete and ready for implementation. These types provide:
- **Type Safety**: Compile-time checks for all data structures
- **Auto-completion**: IDE support for property names and types
- **Documentation**: Interfaces serve as living documentation
- **Validation**: Zod schemas can be derived from these types

**Next Step**: Proceed to API contracts documentation
