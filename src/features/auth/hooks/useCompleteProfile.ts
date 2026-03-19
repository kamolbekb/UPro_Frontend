import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { completeProfile } from '../api/authApi';
import { useAuthStore } from './useAuthStore';
import { ROUTES } from '@/shared/constants/routes';
import type { CompleteProfileRequest, CompleteProfileResponse } from '../types/auth.types';

/**
 * Hook for completing user profile after first login
 *
 * Flow:
 * 1. User logs in for the first time (isProfileCompleted = false)
 * 2. User is redirected to profile completion page
 * 3. User fills in first name and last name
 * 4. On success, isProfileCompleted is set to true and user is navigated to tasks
 */
export function useCompleteProfile() {
  const navigate = useNavigate();
  const setProfileCompleted = useAuthStore((state) => state.setProfileCompleted);

  return useMutation<CompleteProfileResponse, Error, CompleteProfileRequest>({
    mutationFn: completeProfile,
    onSuccess: (data) => {
      setProfileCompleted(data.isProfileCompleted);
      toast.success('Profile completed successfully!');
      navigate(ROUTES.TASKS, { replace: true });
    },
    onError: (error) => {
      console.error('Failed to complete profile:', error);
    },
  });
}
