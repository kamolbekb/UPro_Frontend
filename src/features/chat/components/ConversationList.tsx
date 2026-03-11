import { Card } from '@shared/components/ui/card';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import type { Conversation } from '../types/chat.types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[] | undefined;
  isLoading: boolean;
  selectedConversationId?: string | undefined;
  onSelectConversation: (conversationId: string) => void;
}

/**
 * Conversation list component
 *
 * Features:
 * - Shows conversation cards with participant info
 * - Displays last message and timestamp
 * - Unread count badge
 * - Clickable to select conversation
 *
 * Usage:
 * ```tsx
 * <ConversationList
 *   conversations={conversations}
 *   isLoading={isLoading}
 *   selectedConversationId={selectedId}
 *   onSelectConversation={setSelectedId}
 * />
 * ```
 */
export function ConversationList({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <EmptyState
        title="No Conversations"
        description="Start a conversation by messaging an executor from a task"
      />
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedConversationId;
        const initials = conversation.participantName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();

        return (
          <Card
            key={conversation.id}
            className={`cursor-pointer p-4 transition-colors hover:bg-accent ${
              isSelected ? 'bg-accent' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              {conversation.participantImage ? (
                <img
                  src={conversation.participantImage}
                  alt={conversation.participantName}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {initials}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">
                    {conversation.participantName}
                  </h3>
                  {conversation.lastMessageTime && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(conversation.lastMessageTime), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>

                {conversation.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                )}
              </div>

              {/* Unread Badge */}
              {conversation.unreadCount > 0 && (
                <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
