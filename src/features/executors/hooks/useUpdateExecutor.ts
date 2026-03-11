import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateProfile } from '../api/executorApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { UpdateExecutorRequest } from '../types/executor.types';

/**
 * Hook for updating executor profile
 *
 * Updates executor profile, invalidates cache, and shows success toast.
 *
 * @returns Mutation object with update profile function
 */
export function useUpdateExecutor() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateExecutorRequest>({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Invalidate executor profile to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.executors.profile() });

      // Show success message
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      // Show error message
      toast.error(error.message || 'Failed to update profile. Please try again.');
    },
  });
}
