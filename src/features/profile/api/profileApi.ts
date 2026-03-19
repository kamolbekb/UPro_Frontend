import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type {
  UpdateMyProfileRequest,
  UserProfile,
} from '@features/auth/types/auth.types';

/**
 * Get current user's full profile
 *
 * @returns User profile data
 */
export async function getCurrentUser(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>(ENDPOINTS.users.currentUser);
  return response.data;
}

/**
 * Update current user's profile
 *
 * @param data - Updated profile data (multipart/form-data)
 * @returns Success
 */
export async function updateMyProfile(data: UpdateMyProfileRequest): Promise<void> {
  const formData = new FormData();
  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);

  if (data.image) {
    formData.append('image', data.image);
  }

  await apiClient.put(ENDPOINTS.users.myProfile, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * Delete current user's profile
 *
 * @returns Success boolean
 */
export async function deleteMyProfile(): Promise<boolean> {
  const response = await apiClient.delete<boolean>(ENDPOINTS.users.myProfile);
  return response.data;
}

/**
 * Upload profile image
 *
 * @param image - Image file
 * @returns Success boolean
 */
export async function setProfileImage(image: File): Promise<boolean> {
  const formData = new FormData();
  formData.append('image', image);

  const response = await apiClient.post<boolean>(
    ENDPOINTS.users.profileImage,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

/**
 * Delete profile image
 *
 * @returns Success boolean
 */
export async function deleteProfileImage(): Promise<boolean> {
  const response = await apiClient.delete<boolean>(ENDPOINTS.users.profileImage);
  return response.data;
}
