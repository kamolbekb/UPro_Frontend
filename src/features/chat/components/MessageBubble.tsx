import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import type { Message } from '../types/chat.types';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

/**
 * Message bubble component
 *
 * Features:
 * - Different styling for sent vs received messages
 * - Timestamp display
 * - Read status indicator (single/double check)
 * - Sender name for received messages
 *
 * Usage:
 * ```tsx
 * <MessageBubble message={message} isSent={message.senderId === currentUserId} />
 * ```
 */
export function MessageBubble({ message, isSent }: MessageBubbleProps) {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isSent
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        {/* Sender name for received messages */}
        {!isSent && (
          <div className="mb-1 text-xs font-semibold text-muted-foreground">
            {message.senderName}
          </div>
        )}

        {/* Message content */}
        <div className="break-words">{message.content}</div>

        {/* Timestamp and read status */}
        <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
          <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
          {isSent && (
            <>
              {message.isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
