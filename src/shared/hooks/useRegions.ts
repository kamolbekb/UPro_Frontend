import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@shared/api/locationApi';
import { queryKeys } from '@shared/constants/queryKeys';

/**
 * Fetch regions with districts
 *
 * Regions are cached for 10 minutes to reduce API calls.
 * Use for location dropdowns, filters, and task creation.
 *
 * @returns Query result with regions and districts
 */
export function useRegions() {
  return useQuery({
    queryKey: queryKeys.regions.all,
    queryFn: getRegions,
    staleTime: 1000 * 60 * 10, // 10 minutes - regions don't change often
    gcTime: 1000 * 60 * 30, // 30 minutes in cache
  });
}
