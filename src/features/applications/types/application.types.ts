/**
 * Task Application types
 * Maps to backend OrderTaskApplication entity and DTOs
 */

/**
 * Application status enum
 */
export enum ApplicationStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Completed = 3,
}

/**
 * Request to apply for a task
 */
export interface ApplyTaskRequest {
  taskId: string;
  coverLetter?: string;
}

/**
 * Executor application info (shown to task creator)
 */
export interface ExecutorApplication {
  id: string;
  executorId: string;
  executorName: string;
  executorImage: string | null;
  executorRating: number | null;
  completedTasks: number;
  coverLetter: string | null;
  status: ApplicationStatus;
  appliedAt: string;
}

/**
 * Task with application info (for creator/executor dashboards)
 */
export interface TaskApplicationItem {
  id: string;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  status: ApplicationStatus;
  applicantCount: number;
  createdAt: string;
  budget: number | null;
  budgetTypeName: string | null;
}
