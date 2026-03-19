import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  applyForTask,
  getTaskApplications,
  acceptApplication,
  completeApplication,
  rejectApplication,
  getCreatorTasks,
  getExecutorTasks,
} from '../api/applicationApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { ApplyTaskRequest } from '../types/application.types';

/**
 * Hook to apply for a task
 */
export function useApplyForTask() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, ApplyTaskRequest>({
    mutationFn: applyForTask,
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
    onError: (error) => {
      console.error('Failed to apply for task:', error);
    },
  });
}

/**
 * Hook to get executor applications for a task (task creator view)
 */
export function useTaskApplications(taskId: string) {
  return useQuery({
    queryKey: queryKeys.applications.executors(taskId),
    queryFn: () => getTaskApplications(taskId),
    enabled: !!taskId,
  });
}

/**
 * Hook to accept an application
 */
export function useAcceptApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptApplication,
    onSuccess: () => {
      toast.success('Application accepted!');
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

/**
 * Hook to complete an application
 */
export function useCompleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeApplication,
    onSuccess: () => {
      toast.success('Task marked as completed!');
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

/**
 * Hook to reject an application
 */
export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      toast.success('Application rejected.');
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}

/**
 * Hook to get tasks created by current user with application info
 */
export function useCreatorTasks() {
  return useQuery({
    queryKey: queryKeys.applications.creatorTasks(),
    queryFn: getCreatorTasks,
  });
}

/**
 * Hook to get tasks the executor has applied to
 */
export function useExecutorTasks(status?: number) {
  return useQuery({
    queryKey: queryKeys.applications.executorTasks(status),
    queryFn: () => getExecutorTasks(status),
  });
}
