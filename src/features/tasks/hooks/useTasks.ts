import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/queryKeys';
import { getAll } from '../api/taskApi';
import type { TaskFilters } from '../types/task.types';

/**
 * Fetch tasks with infinite scroll pagination
 *
 * Uses TanStack Query's useInfiniteQuery to handle paginated task lists.
 * Automatically loads next page when user scrolls to bottom.
 *
 * @param filters - Search term, category, location, budget filters
 * @returns Infinite query result with tasks and pagination controls
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks({
 *   searchTerm: 'web development',
 *   categoryId: '123',
 * });
 *
 * // Access tasks across all pages
 * const allTasks = data?.pages.flatMap(page => page.items) ?? [];
 *
 * // Load next page on scroll
 * if (hasNextPage && !isFetchingNextPage) {
 *   fetchNextPage();
 * }
 */
export function useTasks(filters?: TaskFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.tasks.list(filters ?? {}),
    queryFn: ({ pageParam = 1 }) =>
      getAll({
        ...filters,
        page: pageParam,
        limit: filters?.limit ?? 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Return next page number if there are more pages, otherwise undefined
      return lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - tasks update frequently
    gcTime: 1000 * 60 * 5, // 5 minutes in cache
  });
}
