import { useInfiniteQuery } from '@tanstack/react-query';
import { getMessages } from '../api/chatApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { MessagesResponse } from '../types/chat.types';

/**
 * Hook for fetching message history with infinite scroll
 *
 * Features:
 * - Infinite query for scroll-to-load-more functionality
 * - 50 messages per page
 * - Auto-refetch on new message (handled by useChatHub cache invalidation)
 *
 * Usage:
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(conversationId);
 * ```
 *
 * @param conversationId - Conversation UUID
 * @returns Infinite query object with message pages
 */
export function useMessages(conversationId: string | undefined) {
  return useInfiniteQuery<MessagesResponse>({
    queryKey: queryKeys.chat.messages(conversationId ?? ''),
    queryFn: ({ pageParam = 1 }) =>
      getMessages({
        conversationId: conversationId!,
        page: pageParam as number,
        limit: 50,
      }),
    enabled: !!conversationId,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
