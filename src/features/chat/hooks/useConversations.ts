import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../api/chatApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { Conversation } from '../types/chat.types';

/**
 * Hook for fetching conversation list
 *
 * Features:
 * - Auto-refetch on new message (handled by useChatHub cache invalidation)
 * - Returns conversations sorted by last message time
 *
 * @returns Query object with conversation list
 */
export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: queryKeys.chat.conversations(),
    queryFn: getConversations,
    // Refetch on window focus to catch new conversations
    refetchOnWindowFocus: true,
  });
}
