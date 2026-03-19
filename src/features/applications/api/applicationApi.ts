import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type {
  ApplyTaskRequest,
  ExecutorApplication,
  TaskApplicationItem,
} from '../types/application.types';

/**
 * Apply for a task as an executor
 *
 * @param data - Task ID and optional cover letter
 * @returns Application ID
 */
export async function applyForTask(data: ApplyTaskRequest): Promise<string> {
  const response = await apiClient.post<string>(ENDPOINTS.applications.apply, data);
  return response.data;
}

/**
 * Get all executor applications for a specific task (task creator view)
 *
 * @param taskId - Task UUID
 * @returns List of executor applications
 */
export async function getTaskApplications(
  taskId: string
): Promise<ExecutorApplication[]> {
  const response = await apiClient.get<ExecutorApplication[]>(
    ENDPOINTS.applications.executors(taskId)
  );
  return response.data;
}

/**
 * Accept an executor's application
 *
 * @param applicationId - Application UUID
 */
export async function acceptApplication(
  applicationId: string
): Promise<TaskApplicationItem> {
  const response = await apiClient.post<TaskApplicationItem>(
    ENDPOINTS.applications.accept(applicationId)
  );
  return response.data;
}

/**
 * Complete a task application (mark as done)
 *
 * @param applicationId - Application UUID
 */
export async function completeApplication(
  applicationId: string
): Promise<TaskApplicationItem> {
  const response = await apiClient.post<TaskApplicationItem>(
    ENDPOINTS.applications.complete(applicationId)
  );
  return response.data;
}

/**
 * Reject an executor's application
 *
 * @param applicationId - Application UUID
 */
export async function rejectApplication(
  applicationId: string
): Promise<TaskApplicationItem> {
  const response = await apiClient.post<TaskApplicationItem>(
    ENDPOINTS.applications.reject(applicationId)
  );
  return response.data;
}

/**
 * Get tasks created by current user with their applications
 * (Task creator dashboard)
 *
 * @returns List of user's tasks with application info
 */
export async function getCreatorTasks(): Promise<TaskApplicationItem[]> {
  const response = await apiClient.get<TaskApplicationItem[]>(
    ENDPOINTS.applications.creatorTasks
  );
  return response.data;
}

/**
 * Get tasks the current user has applied to as executor
 * (Executor dashboard)
 *
 * @param status - Filter by application status (0=all)
 * @returns List of applied tasks
 */
export async function getExecutorTasks(
  status?: number
): Promise<TaskApplicationItem[]> {
  const params = status !== undefined ? `?status=${status}` : '';
  const response = await apiClient.get<TaskApplicationItem[]>(
    `${ENDPOINTS.applications.executorTasks}${params}`
  );
  return response.data;
}
