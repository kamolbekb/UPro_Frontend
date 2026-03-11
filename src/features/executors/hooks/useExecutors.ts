import { useQuery } from '@tanstack/react-query';
import { getAll } from '../api/executorApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { ExecutorListItem } from '../types/executor.types';

/**
 * Hook for fetching all executors
 *
 * Fetches public executor list with basic profile information.
 *
 * @returns Query object with executor list
 */
export function useExecutors() {
  return useQuery<ExecutorListItem[]>({
    queryKey: queryKeys.executors.lists(),
    queryFn: async () => {
      const result = await getAll();
      return result.items;
    },
  });
}
