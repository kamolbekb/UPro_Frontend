import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type { PaginatedResult } from '@shared/api/types';
import type {
  ExecutorProfile,
  BecomeExecutorFormData,
  BecomeExecutorResponse,
  UpdateExecutorRequest,
  ExecutorListItem,
  ExecutorFilters,
  Language,
  EducationType,
} from '../types/executor.types';

/**
 * Normalize serviceFields from backend.
 * Backend returns [{categoryId, categoryName}] but frontend expects string[].
 */
function normalizeServiceFields(
  fields: unknown[] | undefined
): string[] {
  if (!fields || !Array.isArray(fields)) return [];
  return fields.map((f) => {
    if (typeof f === 'string') return f;
    if (typeof f === 'object' && f !== null && 'categoryName' in f) {
      return String((f as { categoryName: string }).categoryName);
    }
    return String(f);
  });
}

/**
 * Become an executor (register as executor)
 *
 * @param data - Executor profile data with image
 * @returns Created executor profile details
 */
export async function becomeExecutor(
  data: BecomeExecutorFormData
): Promise<BecomeExecutorResponse> {
  const formData = new FormData();

  // Append image if provided
  if (data.image) {
    formData.append('image', data.image);
  }

  // Personal Info
  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  formData.append('birthDate', data.birthDate);

  // Service Info
  formData.append('serviceLocationId', data.serviceLocationId);
  formData.append('serviceFields', JSON.stringify(data.serviceFields));

  // Work Experience (JSON stringified array)
  formData.append('workExperience', JSON.stringify(data.workExperience));

  // Education (JSON stringified array)
  formData.append('education', JSON.stringify(data.education));

  // Languages (JSON stringified array)
  formData.append('languages', JSON.stringify(data.languages));

  const response = await apiClient.post<BecomeExecutorResponse>(
    ENDPOINTS.executors.become,
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
 * Get current user's executor profile
 *
 * @returns Executor profile data
 */
export async function getMyProfile(): Promise<ExecutorProfile> {
  const response = await apiClient.get<ExecutorProfile>(ENDPOINTS.executors.myProfile);
  const data = response.data;
  data.serviceFields = normalizeServiceFields(data.serviceFields as unknown[]);
  return data;
}

/**
 * Update executor profile
 *
 * @param data - Updated profile data
 * @returns Updated profile response
 */
export async function updateProfile(data: UpdateExecutorRequest): Promise<void> {
  const formData = new FormData();

  // Append image if provided
  if (data.image) {
    formData.append('image', data.image);
  }

  // Personal Info
  if (data.firstName) formData.append('firstName', data.firstName);
  if (data.lastName) formData.append('lastName', data.lastName);
  if (data.birthDate) formData.append('birthDate', data.birthDate);

  // Service Info
  if (data.serviceLocationId) {
    formData.append('serviceLocationId', data.serviceLocationId);
  }
  if (data.serviceFields) {
    formData.append('serviceFields', data.serviceFields);
  }

  // Arrays (JSON stringified)
  if (data.workExperience) {
    formData.append('workExperience', data.workExperience);
  }
  if (data.education) {
    formData.append('education', data.education);
  }
  if (data.languages) {
    formData.append('languages', data.languages);
  }

  // Availability
  if (data.isAvailable !== undefined) {
    formData.append('isAvailable', data.isAvailable.toString());
  }

  await apiClient.put(ENDPOINTS.executors.updateProfile, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Delete executor profile
 */
export async function deleteProfile(): Promise<void> {
  await apiClient.delete(ENDPOINTS.executors.deleteProfile);
}

/**
 * Get all executors with filters
 * Backend expects POST with ExecutorFilterOptions body
 *
 * @param filters - Search and filter criteria
 * @returns Paginated executor list
 */
export async function getAll(
  filters?: ExecutorFilters
): Promise<PaginatedResult<ExecutorListItem>> {
  const body: Record<string, unknown> = {
    pageNumber: filters?.page ?? 1,
    pageSize: filters?.limit ?? 10,
  };

  if (filters?.searchTerm) {
    body.searchTerm = filters.searchTerm;
  }
  if (filters?.categoryId) {
    body.subCategoryId = filters.categoryId;
  }
  if (filters?.districtId) {
    body.serviceLocationId = filters.districtId;
  }

  const response = await apiClient.post<PaginatedResult<ExecutorListItem>>(
    ENDPOINTS.executors.list,
    body
  );
  const data = response.data;
  // Normalize serviceFields from backend objects to strings
  if (data.items) {
    data.items = data.items.map((item) => ({
      ...item,
      serviceFields: normalizeServiceFields(item.serviceFields as unknown[]),
    }));
  }
  return data;
}

/**
 * Get executor profile by ID
 *
 * @param id - Executor UUID
 * @returns Executor profile data
 */
export async function getById(id: string): Promise<ExecutorProfile> {
  const response = await apiClient.get<ExecutorProfile>(ENDPOINTS.executors.profile(id));
  const data = response.data;
  data.serviceFields = normalizeServiceFields(data.serviceFields as unknown[]);
  return data;
}

/**
 * Get all languages (for dropdown)
 *
 * @param searchTerm - Optional search filter
 * @returns List of languages
 */
export async function getLanguages(searchTerm?: string): Promise<Language[]> {
  const params = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : '';
  const response = await apiClient.get<Language[]>(
    `${ENDPOINTS.executors.languages}${params}`
  );
  return response.data;
}

/**
 * Get all education types (for dropdown)
 *
 * @returns List of education types
 */
export async function getEducationTypes(): Promise<EducationType[]> {
  const response = await apiClient.get<EducationType[]>(ENDPOINTS.executors.educationTypes);
  return response.data;
}

/**
 * Get language proficiency levels (for dropdown)
 *
 * @returns List of language levels
 */
export async function getLanguageLevels(): Promise<{ id: number; name: string }[]> {
  const response = await apiClient.get<{ id: number; name: string }[]>(
    ENDPOINTS.executors.languageLevels
  );
  return response.data;
}
