import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../api/executorApi';
import { queryKeys } from '@shared/constants/queryKeys';

/**
 * Hook to fetch current user's executor profile
 *
 * Fetches and caches the logged-in user's executor profile.
 * Returns null if user is not an executor.
 *
 * @returns Query result with executor profile data
 */
export function useExecutorProfile() {
  return useQuery({
    queryKey: queryKeys.executors.profile(),
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes in cache
    retry: false, // Don't retry if user is not an executor
  });
}
