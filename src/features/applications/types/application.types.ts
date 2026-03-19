/**
 * Task Application types
 * Maps to backend OrderTaskApplication entity and DTOs
 */

/**
 * Application status enum
 * Maps to backend ApplicationStatus enum
 */
export enum ApplicationStatus {
  Applied = 1,
  Viewed = 2,
  Accepted = 3,
  Completed = 4,
  Rejected = 5,
  Archived = 6,
}

/**
 * Request to apply for a task
 */
export interface ApplyTaskRequest {
  taskId: string;
  coverLetter?: string;
}

/**
 * Executor limited data shown to task creator (ExecutorLimitDataDto)
 */
export interface ExecutorLimitData {
  id: string;
  applicationId: string;
  fullName: string | null;
  coverLetter: string | null;
  image: string | null;
}

/**
 * Creator's task item (OrderTaskLimitItemDto)
 * Returned from GET /creator/tasks
 */
export interface CreatorTaskItem {
  id: string;
  code: string;
  title: string;
  locationTypeName: string;
  districtName: string;
  startDate: string | null;
  budget: number | null;
  image: string | null;
  isArchived: boolean;
}

/**
 * Executor's applied task item (OrderTaskApplicationLimitItemDto)
 * Returned from GET /executor/tasks
 */
export interface ExecutorTaskItem {
  id: string;
  code: string;
  title: string;
  locationTypeName: string;
  districtName: string;
  startDate: string | null;
  budget: number | null;
  image: string | null;
  applicationStatusName: string;
  isArchived: boolean;
}
