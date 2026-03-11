import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { PaginatedResult } from '@shared/api/types';
import type {
  Task,
  TaskDetail,
  TaskFilters,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from '../types/task.types';

/**
 * API response for task search/list
 */
export interface TaskListResponse {
  items: Task[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Get all tasks with optional search and filters
 *
 * @param filters - Search term, category, location, budget filters
 * @returns Paginated task list
 */
export async function getAll(filters?: TaskFilters): Promise<PaginatedResult<Task>> {
  const params = new URLSearchParams();

  if (filters?.searchTerm) {
    params.append('searchTerm', filters.searchTerm);
  }
  if (filters?.categoryId) {
    params.append('categoryId', filters.categoryId);
  }
  if (filters?.subCategoryId) {
    params.append('subCategoryId', filters.subCategoryId);
  }
  if (filters?.regionId) {
    params.append('regionId', filters.regionId);
  }
  if (filters?.districtId) {
    params.append('districtId', filters.districtId);
  }
  if (filters?.budgetTypeId) {
    params.append('budgetTypeId', filters.budgetTypeId);
  }
  if (filters?.minBudget !== undefined) {
    params.append('minBudget', filters.minBudget.toString());
  }
  if (filters?.maxBudget !== undefined) {
    params.append('maxBudget', filters.maxBudget.toString());
  }
  if (filters?.status !== undefined) {
    params.append('status', filters.status.toString());
  }
  if (filters?.page) {
    params.append('page', filters.page.toString());
  }
  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }

  const url = `${ENDPOINTS.tasks.search}?${params.toString()}`;
  const response = await apiClient.get<PaginatedResult<Task>>(url);
  return response.data;
}

/**
 * Get task by ID with full details
 *
 * @param id - Task UUID
 * @returns Task details including client info and applications
 */
export async function getById(id: string): Promise<TaskDetail> {
  const response = await apiClient.get<TaskDetail>(ENDPOINTS.tasks.byId(id));
  return response.data;
}

/**
 * Search tasks (alias for getAll for clarity)
 *
 * @param filters - Search and filter criteria
 * @returns Paginated task list
 */
export async function searchTasks(filters?: TaskFilters): Promise<PaginatedResult<Task>> {
  return getAll(filters);
}

/**
 * Bookmark/save a task
 *
 * @param taskId - Task UUID
 */
export async function bookmarkTask(taskId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.tasks.save(taskId));
}

/**
 * Remove bookmark from a task
 *
 * @param taskId - Task UUID
 */
export async function unbookmarkTask(taskId: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.tasks.save(taskId));
}

/**
 * Get user's bookmarked tasks
 *
 * @returns List of bookmarked tasks
 */
export async function getSavedTasks(): Promise<Task[]> {
  const response = await apiClient.get<Task[]>(ENDPOINTS.tasks.saved);
  return response.data;
}

/**
 * Create a new task
 *
 * @param data - Task creation data
 * @returns Created task details
 */
export async function create(data: CreateTaskRequest): Promise<CreateTaskResponse> {
  // Build FormData for multipart/form-data submission
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('categoryId', data.categoryId);
  if (data.subCategoryId) {
    formData.append('subCategoryId', data.subCategoryId);
  }
  formData.append('budgetTypeId', data.budgetTypeId);
  formData.append('budgetAmount', data.budgetAmount.toString());
  formData.append('serviceLocationId', data.serviceLocationId);

  // Append images if provided
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await apiClient.post<CreateTaskResponse>(
    ENDPOINTS.tasks.create,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

/**
 * Save task as draft
 *
 * @param data - Task data (same as create but saved with Draft status)
 * @returns Created draft task details
 */
export async function saveDraft(data: CreateTaskRequest): Promise<CreateTaskResponse> {
  // Build FormData for multipart/form-data submission
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('categoryId', data.categoryId);
  if (data.subCategoryId) {
    formData.append('subCategoryId', data.subCategoryId);
  }
  formData.append('budgetTypeId', data.budgetTypeId);
  formData.append('budgetAmount', data.budgetAmount.toString());
  formData.append('serviceLocationId', data.serviceLocationId);
  formData.append('status', '0'); // Draft status = 0

  // Append images if provided
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await apiClient.post<CreateTaskResponse>(
    ENDPOINTS.tasks.create,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}

/**
 * Update an existing task
 *
 * @param id - Task UUID
 * @param data - Task update data
 * @returns Updated task details
 */
export async function updateTask(
  id: string,
  data: UpdateTaskRequest
): Promise<UpdateTaskResponse> {
  // Build FormData for multipart/form-data submission
  const formData = new FormData();

  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.categoryId) formData.append('categoryId', data.categoryId);
  if (data.subCategoryId) formData.append('subCategoryId', data.subCategoryId);
  if (data.budgetTypeId) formData.append('budgetTypeId', data.budgetTypeId);
  if (data.budgetAmount !== undefined) {
    formData.append('budgetAmount', data.budgetAmount.toString());
  }
  if (data.serviceLocationId) {
    formData.append('serviceLocationId', data.serviceLocationId);
  }
  if (data.status !== undefined) {
    formData.append('status', data.status.toString());
  }

  // Append images if provided
  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await apiClient.put<UpdateTaskResponse>(
    ENDPOINTS.tasks.update(id),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
