import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getCurrentUser,
  updateMyProfile,
  deleteMyProfile,
  setProfileImage,
  deleteProfileImage,
} from '../api/profileApi';
import { queryKeys } from '@shared/constants/queryKeys';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { ROUTES } from '@shared/constants/routes';
import type { UpdateMyProfileRequest } from '@features/auth/types/auth.types';

/**
 * Hook to fetch the current user's full profile
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.profile.currentUser(),
    queryFn: getCurrentUser,
  });
}

/**
 * Hook to update the current user's profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateMyProfileRequest>({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });
}

/**
 * Hook to delete the current user's account
 */
export function useDeleteProfile() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation<boolean, Error>({
    mutationFn: deleteMyProfile,
    onSuccess: () => {
      toast.success('Account deleted successfully.');
      logout();
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      console.error('Failed to delete profile:', error);
    },
  });
}

/**
 * Hook to upload a profile image
 */
export function useSetProfileImage() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, File>({
    mutationFn: setProfileImage,
    onSuccess: () => {
      toast.success('Profile image updated!');
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
    onError: (error) => {
      console.error('Failed to upload profile image:', error);
    },
  });
}

/**
 * Hook to delete the profile image
 */
export function useDeleteProfileImage() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error>({
    mutationFn: deleteProfileImage,
    onSuccess: () => {
      toast.success('Profile image removed.');
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
    onError: (error) => {
      console.error('Failed to delete profile image:', error);
    },
  });
}
