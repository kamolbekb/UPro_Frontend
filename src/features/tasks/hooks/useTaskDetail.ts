import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/queryKeys';
import { getById } from '../api/taskApi';

/**
 * Fetch single task by ID with full details
 *
 * Returns task with client information and executor applications.
 * Use for task detail page.
 *
 * @param id - Task UUID
 * @returns Query result with task details
 *
 * @example
 * const { data: task, isLoading } = useTaskDetail('task-uuid');
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!task) return <NotFound />;
 *
 * return <TaskDetailView task={task} />;
 */
export function useTaskDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => getById(id),
    enabled: !!id, // Only run query if ID is provided
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes in cache
  });
}
