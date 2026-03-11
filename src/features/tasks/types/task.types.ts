/**
 * Task-related TypeScript interfaces and types
 * Maps to backend OrderTask entity and related DTOs
 */

/**
 * Task status enumeration
 * Maps to backend TaskStatus enum
 */
export enum TaskStatus {
  Draft = 0,
  Published = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

/**
 * Budget type classification
 */
export interface BudgetType {
  id: string; // UUID
  name: string; // "Fixed" | "Hourly"
}

/**
 * Category with hierarchical structure
 */
export interface Category {
  id: string; // UUID
  name: string;
  description?: string | null;
  parentId: string | null; // Null for top-level categories
  children?: Category[]; // Subcategories
}

/**
 * Geographic region
 */
export interface Region {
  id: string; // UUID
  name: string; // "Tashkent", "Samarkand", etc.
  districts: District[];
}

/**
 * Geographic district within a region
 */
export interface District {
  id: string; // UUID
  name: string; // "Yunusabad", "Chilanzar", etc.
  regionId: string; // UUID
  regionName?: string;
}

/**
 * Task application from executor
 */
export interface TaskApplication {
  id: string; // UUID
  taskId: string;
  executorId: string;
  executorName: string;
  executorImage: string | null;
  executorRating: number | null; // 0-5
  proposedBudget: number;
  coverLetter: string;
  estimatedDuration: string; // e.g., "3 days", "1 week"
  status: ApplicationStatus;
  createdAt: string; // ISO 8601
}

export enum ApplicationStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Withdrawn = 3,
}

/**
 * Task entity (list view)
 */
export interface Task {
  id: string; // UUID
  title: string;
  description: string;
  categoryId: string; // UUID
  categoryName: string; // Display name
  subCategoryId: string | null;
  subCategoryName: string | null;
  budgetTypeId: string; // UUID
  budgetTypeName: string; // "Fixed" | "Hourly"
  budgetAmount: number; // In local currency (UZS)
  serviceLocationId: string; // District UUID
  regionName: string; // "Tashkent", "Samarkand", etc.
  districtName: string; // "Yunusabad", etc.
  images: string[]; // Array of image URLs
  status: TaskStatus;
  applicationCount: number; // Number of executor applications
  isBookmarked: boolean; // True if current user bookmarked
  createdBy: string; // User ID of task creator
  createdAt: string; // ISO 8601
  modifiedAt: string | null; // ISO 8601
}

/**
 * Task with client details (detail view)
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

/**
 * Task filters for search/browse
 */
export interface TaskFilters {
  searchTerm?: string;
  categoryId?: string;
  subCategoryId?: string;
  regionId?: string;
  districtId?: string;
  budgetTypeId?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: TaskStatus;
  page?: number;
  limit?: number;
}

/**
 * Task creation form data
 */
export interface CreateTaskFormData {
  title: string;
  description: string;
  categoryId: string;
  subCategoryId?: string;
  budgetTypeId: string;
  budgetAmount: number;
  serviceLocationId: string; // District UUID
  images: File[]; // Image files for upload
}

/**
 * Task update form data
 */
export interface UpdateTaskFormData {
  title?: string;
  description?: string;
  categoryId?: string;
  subCategoryId?: string;
  budgetTypeId?: string;
  budgetAmount?: number;
  serviceLocationId?: string;
  images?: File[];
  status?: TaskStatus;
}

/**
 * API request payload for creating a task
 * Sent as multipart/form-data with FormData
 */
export interface CreateTaskRequest {
  title: string;
  description: string;
  categoryId: string;
  subCategoryId?: string | undefined;
  budgetTypeId: string;
  budgetAmount: number;
  serviceLocationId: string; // District UUID
  images?: File[] | undefined; // Image files (max 5, max 5MB each)
}

/**
 * API response for task creation
 * Returned from POST /api/OrderTasks
 */
export interface CreateTaskResponse {
  id: string; // UUID of created task
  title: string;
  status: TaskStatus; // Should be Draft or Published
  createdAt: string; // ISO 8601
}

/**
 * API request payload for updating a task
 */
export interface UpdateTaskRequest {
  title?: string | undefined;
  description?: string | undefined;
  categoryId?: string | undefined;
  subCategoryId?: string | undefined;
  budgetTypeId?: string | undefined;
  budgetAmount?: number | undefined;
  serviceLocationId?: string | undefined;
  images?: File[] | undefined;
  status?: TaskStatus | undefined;
}

/**
 * API response for task update
 */
export interface UpdateTaskResponse {
  id: string;
  modifiedAt: string; // ISO 8601
}
