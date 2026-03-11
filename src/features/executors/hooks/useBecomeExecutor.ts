import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { becomeExecutor } from '../api/executorApi';
import { queryKeys } from '@shared/constants/queryKeys';
import { ROUTES } from '@shared/constants/routes';
import type { BecomeExecutorFormData, BecomeExecutorResponse } from '../types/executor.types';

/**
 * Hook for becoming an executor
 *
 * Registers user as executor, invalidates executor profile cache,
 * shows success toast, and navigates to executor profile page.
 *
 * @returns Mutation object with become executor function
 */
export function useBecomeExecutor() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<BecomeExecutorResponse, Error, BecomeExecutorFormData>({
    mutationFn: becomeExecutor,
    onSuccess: (data) => {
      // Invalidate executor profile to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.executors.profile() });

      // Show success message
      toast.success('Successfully registered as executor!');

      // Navigate to executor profile page using the returned executor ID
      navigate(ROUTES.EXECUTOR_PROFILE(data.id));
    },
    onError: (error) => {
      // Show error message
      toast.error(error.message || 'Failed to register as executor. Please try again.');
    },
  });
}
