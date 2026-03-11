import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@shared/api/categoryApi';
import { queryKeys } from '@shared/constants/queryKeys';

/**
 * Fetch categories with hierarchical structure
 *
 * Categories are cached for 10 minutes to reduce API calls.
 * Use for category dropdowns, filters, and browsing.
 *
 * @returns Query result with category tree
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes - categories don't change often
    gcTime: 1000 * 60 * 30, // 30 minutes in cache
  });
}
