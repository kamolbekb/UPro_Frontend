import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSignalR } from '@/app/providers/SignalRProvider';
import { queryKeys } from '@shared/constants/queryKeys';
import type {
  ReceiveMessageEvent,
  UserTypingEvent,
  MessageReadEvent,
  TypingIndicator,
} from '../types/chat.types';

/**
 * Hook for managing SignalR chat hub events and methods
 *
 * Features:
 * - ReceiveMessage event listener with optimistic cache updates
 * - UserTyping/UserStoppedTyping event listeners with auto-clear (3s)
 * - SendMessage, SendTypingIndicator, MarkAsRead method invocations
 *
 * Usage:
 * ```tsx
 * const { sendMessage, sendTypingIndicator, markAsRead } = useChatHub({
 *   onMessageReceived: (message) => console.log(message),
 *   onUserTyping: (indicator) => console.log(indicator),
 * });
 * ```
 */

interface UseChatHubOptions {
  onMessageReceived?: (event: ReceiveMessageEvent) => void;
  onUserTyping?: (indicator: TypingIndicator) => void;
  onMessageRead?: (event: MessageReadEvent) => void;
}

export function useChatHub(options: UseChatHubOptions = {}) {
  const { connection } = useSignalR();
  const queryClient = useQueryClient();
  const typingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /**
   * Send a message via SignalR
   */
  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      if (!connection) {
        throw new Error('SignalR connection not available');
      }

      await connection.invoke('SendMessage', conversationId, content);
    },
    [connection]
  );

  /**
   * Send typing indicator
   */
  const sendTypingIndicator = useCallback(
    async (conversationId: string, isTyping: boolean) => {
      if (!connection) return;

      if (isTyping) {
        await connection.invoke('SendTypingIndicator', conversationId);
      } else {
        await connection.invoke('StopTyping', conversationId);
      }
    },
    [connection]
  );

  /**
   * Mark message as read
   */
  const markAsRead = useCallback(
    async (conversationId: string, messageId: string) => {
      if (!connection) return;

      await connection.invoke('MarkAsRead', conversationId, messageId);
    },
    [connection]
  );

  /**
   * Setup event listeners
   */
  useEffect(() => {
    if (!connection) return;

    // ReceiveMessage event handler
    const handleReceiveMessage = (event: ReceiveMessageEvent) => {
      // Update TanStack Query cache optimistically
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(event.message.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.conversations(),
      });

      // Call custom handler
      options.onMessageReceived?.(event);
    };

    // UserTyping event handler
    const handleUserTyping = (event: UserTypingEvent) => {
      const key = `${event.conversationId}:${event.userId}`;

      // Clear existing timeout for this user
      const existingTimeout = typingTimeoutsRef.current.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Create typing indicator
      const indicator: TypingIndicator = {
        conversationId: event.conversationId,
        userId: event.userId,
        userName: event.userName,
        isTyping: true,
        timestamp: Date.now(),
      };

      // Call custom handler
      options.onUserTyping?.(indicator);

      // Auto-clear after 3 seconds
      const timeout = setTimeout(() => {
        const stoppedIndicator: TypingIndicator = {
          ...indicator,
          isTyping: false,
        };
        options.onUserTyping?.(stoppedIndicator);
        typingTimeoutsRef.current.delete(key);
      }, 3000);

      typingTimeoutsRef.current.set(key, timeout);
    };

    // UserStoppedTyping event handler
    const handleUserStoppedTyping = (event: UserTypingEvent) => {
      const key = `${event.conversationId}:${event.userId}`;

      // Clear timeout
      const existingTimeout = typingTimeoutsRef.current.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        typingTimeoutsRef.current.delete(key);
      }

      // Create stopped indicator
      const indicator: TypingIndicator = {
        conversationId: event.conversationId,
        userId: event.userId,
        userName: event.userName,
        isTyping: false,
        timestamp: Date.now(),
      };

      options.onUserTyping?.(indicator);
    };

    // MessageRead event handler
    const handleMessageRead = (event: MessageReadEvent) => {
      // Invalidate messages to update read status
      queryClient.invalidateQueries({
        queryKey: queryKeys.chat.messages(event.conversationId),
      });

      options.onMessageRead?.(event);
    };

    // Register event listeners
    connection.on('ReceiveMessage', handleReceiveMessage);
    connection.on('UserTyping', handleUserTyping);
    connection.on('UserStoppedTyping', handleUserStoppedTyping);
    connection.on('MessageRead', handleMessageRead);

    // Cleanup
    return () => {
      connection.off('ReceiveMessage', handleReceiveMessage);
      connection.off('UserTyping', handleUserTyping);
      connection.off('UserStoppedTyping', handleUserStoppedTyping);
      connection.off('MessageRead', handleMessageRead);

      // Clear all typing timeouts
      typingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      typingTimeoutsRef.current.clear();
    };
  }, [connection, queryClient, options]);

  return {
    sendMessage,
    sendTypingIndicator,
    markAsRead,
  };
}
