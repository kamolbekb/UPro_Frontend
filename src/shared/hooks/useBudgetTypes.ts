import { useQuery } from '@tanstack/react-query';
import { getBudgetTypes } from '@shared/api/budgetTypeApi';
import { queryKeys } from '@shared/constants/queryKeys';

/**
 * Hook to fetch budget types with caching
 *
 * Budget types are cached for 10 minutes since they rarely change.
 *
 * @returns Query result with budget types list
 */
export function useBudgetTypes() {
  return useQuery({
    queryKey: queryKeys.budgetTypes.all,
    queryFn: getBudgetTypes,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes in cache
  });
}
