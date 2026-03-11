import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { create } from '../api/taskApi';
import { queryKeys } from '@shared/constants/queryKeys';
import { ROUTES } from '@shared/constants/routes';
import type { CreateTaskRequest, CreateTaskResponse } from '../types/task.types';

/**
 * Hook for creating a new task
 *
 * Creates a task, invalidates task list cache, shows success toast,
 * and navigates to the task detail page.
 *
 * @returns Mutation object with create task function
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<CreateTaskResponse, Error, CreateTaskRequest>({
    mutationFn: create,
    onSuccess: (data) => {
      // Invalidate task lists to refetch with new task
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() });

      // Show success message
      toast.success('Task created successfully!');

      // Navigate to the task detail page
      navigate(ROUTES.TASK_DETAIL(data.id));
    },
    onError: (error) => {
      // Show error message
      toast.error(error.message || 'Failed to create task. Please try again.');
    },
  });
}
