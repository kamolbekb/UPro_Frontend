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
  return response.data;
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
 *
 * @param filters - Search and filter criteria
 * @returns Paginated executor list
 */
export async function getAll(
  filters?: ExecutorFilters
): Promise<PaginatedResult<ExecutorListItem>> {
  const params = new URLSearchParams();

  if (filters?.searchTerm) {
    params.append('searchTerm', filters.searchTerm);
  }
  if (filters?.categoryId) {
    params.append('categoryId', filters.categoryId);
  }
  if (filters?.regionId) {
    params.append('regionId', filters.regionId);
  }
  if (filters?.districtId) {
    params.append('districtId', filters.districtId);
  }
  if (filters?.minRating !== undefined) {
    params.append('minRating', filters.minRating.toString());
  }
  if (filters?.isAvailable !== undefined) {
    params.append('isAvailable', filters.isAvailable.toString());
  }
  if (filters?.page) {
    params.append('page', filters.page.toString());
  }
  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }

  const url = `${ENDPOINTS.executors.list}?${params.toString()}`;
  const response = await apiClient.get<PaginatedResult<ExecutorListItem>>(url);
  return response.data;
}

/**
 * Get executor profile by ID
 *
 * @param id - Executor UUID
 * @returns Executor profile data
 */
export async function getById(id: string): Promise<ExecutorProfile> {
  const response = await apiClient.get<ExecutorProfile>(ENDPOINTS.executors.profile(id));
  return response.data;
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
