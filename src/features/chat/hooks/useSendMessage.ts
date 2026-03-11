import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useChatHub } from './useChatHub';
import { queryKeys } from '@shared/constants/queryKeys';
import type { Message } from '../types/chat.types';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';

interface SendMessageVariables {
  conversationId: string;
  content: string;
}

/**
 * Hook for sending messages with optimistic updates
 *
 * Features:
 * - Optimistic update: Add message immediately to cache
 * - Send via SignalR for real-time delivery
 * - Rollback on error with retry option
 * - Success confirmation via SignalR ReceiveMessage event
 *
 * Usage:
 * ```tsx
 * const { mutate: sendMessage, isPending } = useSendMessage();
 * sendMessage({ conversationId, content: 'Hello!' });
 * ```
 *
 * @returns Mutation object with send message function
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { sendMessage: sendViaSignalR } = useChatHub();
  const { user } = useAuthStore();

  return useMutation<void, Error, SendMessageVariables>({
    mutationFn: async ({ conversationId, content }) => {
      // Create optimistic message
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        senderId: user?.id ?? '',
        senderName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
        senderImage: user?.image ?? null,
        content,
        attachments: [],
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      // Add to cache optimistically
      queryClient.setQueryData(
        queryKeys.chat.messages(conversationId),
        (oldData: unknown) => {
          if (!oldData) return oldData;

          const data = oldData as { pages: Array<{ items: Message[] }> };
          return {
            ...data,
            pages: data.pages.map((page, index: number) => {
              // Add to first page
              if (index === 0) {
                return {
                  ...page,
                  items: [optimisticMessage, ...page.items],
                };
              }
              return page;
            }),
          };
        }
      );

      // Send via SignalR
      await sendViaSignalR(conversationId, content);
    },
    onError: (error, variables) => {
      // Rollback optimistic update
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(variables.conversationId),
      });

      toast.error('Failed to send message. Please try again.');
      console.error('Send message error:', error);
    },
    onSuccess: () => {
      // Update conversation list (last message changed)
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });

      // Note: The actual message will be confirmed via SignalR ReceiveMessage event
      // which will update the cache with the real message ID
    },
  });
}
