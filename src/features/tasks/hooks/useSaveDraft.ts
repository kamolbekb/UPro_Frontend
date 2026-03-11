import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { saveDraft } from '../api/taskApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { CreateTaskRequest, CreateTaskResponse } from '../types/task.types';

/**
 * Hook for saving a task as draft
 *
 * Saves task data with Draft status for later completion.
 * Used for auto-save functionality to prevent data loss.
 *
 * @returns Mutation object with save draft function
 */
export function useSaveDraft() {
  const queryClient = useQueryClient();

  return useMutation<CreateTaskResponse, Error, CreateTaskRequest>({
    mutationFn: saveDraft,
    onSuccess: () => {
      // Invalidate task lists to include new draft
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() });

      // Show subtle success message (auto-save shouldn't be intrusive)
      toast.success('Draft saved', {
        duration: 2000,
        position: 'bottom-right',
      });
    },
    onError: (error) => {
      // Show error message for failed auto-save
      toast.error(error.message || 'Failed to save draft', {
        duration: 3000,
      });
    },
  });
}
