import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ConversationList } from '../components/ConversationList';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { TypingIndicator } from '../components/TypingIndicator';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';
import { useSendMessage } from '../hooks/useSendMessage';
import { useChatHub } from '../hooks/useChatHub';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import type { TypingIndicator as TypingIndicatorType } from '../types/chat.types';

/**
 * Chat page with real-time messaging
 *
 * Features:
 * - Two-column layout: conversation list (left) + active chat (right)
 * - Real-time message delivery via SignalR
 * - Typing indicators with auto-clear
 * - Optimistic updates with error handling
 * - Infinite scroll for message history
 * - Auto-scroll to bottom on new messages
 *
 * Route: /chat/:conversationId?
 */
export function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuthStore();
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(
    conversationId
  );
  const [typingIndicators, setTypingIndicators] = useState<TypingIndicatorType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: conversations, isLoading: isLoadingConversations } = useConversations();
  const { data: messagesData, isLoading: isLoadingMessages, fetchNextPage, hasNextPage } =
    useMessages(selectedConversationId);

  // Mutations
  const { mutate: sendMessage } = useSendMessage();

  // SignalR hub
  const { sendTypingIndicator, markAsRead } = useChatHub({
    onUserTyping: (indicator) => {
      // Update typing indicators state
      setTypingIndicators((prev) => {
        // Remove existing indicator for this user in this conversation
        const filtered = prev.filter(
          (i) =>
            !(
              i.conversationId === indicator.conversationId && i.userId === indicator.userId
            )
        );

        // Add new indicator if typing
        if (indicator.isTyping) {
          return [...filtered, indicator];
        }

        return filtered;
      });
    },
  });

  // Flatten messages from infinite query pages
  const messages = messagesData?.pages.flatMap((page) => page.items) ?? [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Update selected conversation from URL param
  useEffect(() => {
    if (conversationId) {
      setSelectedConversationId(conversationId);
    }
  }, [conversationId]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversationId && messages.length > 0) {
      const unreadMessages = messages.filter((m) => !m.isRead && m.senderId !== user?.id);
      if (unreadMessages.length > 0) {
        const lastMessage = unreadMessages[unreadMessages.length - 1]!;
        markAsRead(selectedConversationId, lastMessage.id);
      }
    }
  }, [selectedConversationId, messages, markAsRead, user?.id]);

  // Handle send message
  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) return;

    sendMessage({
      conversationId: selectedConversationId,
      content,
    });
  };

  // Handle typing indicator
  const handleTypingIndicator = (isTyping: boolean) => {
    if (!selectedConversationId) return;

    sendTypingIndicator(selectedConversationId, isTyping);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Left: Conversation List */}
      <div className="w-80 border-r">
        <div className="border-b p-4">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="p-4">
            <ConversationList
              conversations={conversations}
              isLoading={isLoadingConversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Right: Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedConversationId ? (
          <div className="flex h-full items-center justify-center">
            <EmptyState
              title="Select a Conversation"
              description="Choose a conversation from the list to start chatting"
            />
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="border-b p-4">
              {conversations && (
                <>
                  {(() => {
                    const conversation = conversations.find(
                      (c) => c.id === selectedConversationId
                    );
                    if (!conversation) return null;

                    return (
                      <div className="flex items-center gap-3">
                        {conversation.participantImage ? (
                          <img
                            src={conversation.participantImage}
                            alt={conversation.participantName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {conversation.participantName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </div>
                        )}
                        <h2 className="text-lg font-semibold">
                          {conversation.participantName}
                        </h2>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {/* Load More Button */}
                  {hasNextPage && (
                    <div className="text-center mb-4">
                      <button
                        onClick={() => fetchNextPage()}
                        className="text-sm text-primary hover:underline"
                      >
                        Load more messages
                      </button>
                    </div>
                  )}

                  {/* Messages */}
                  {messages.length === 0 ? (
                    <EmptyState
                      title="No Messages"
                      description="Start the conversation by sending a message"
                    />
                  ) : (
                    <>
                      {messages.map((message) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isSent={message.senderId === user?.id}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </>
              )}
            </ScrollArea>

            {/* Typing Indicator */}
            {typingIndicators.filter(
              (i) => i.conversationId === selectedConversationId && i.isTyping
            ).length > 0 && (
              <TypingIndicator
                indicators={typingIndicators.filter(
                  (i) => i.conversationId === selectedConversationId
                )}
              />
            )}

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTypingIndicator={handleTypingIndicator}
            />
          </>
        )}
      </div>
    </div>
  );
}
