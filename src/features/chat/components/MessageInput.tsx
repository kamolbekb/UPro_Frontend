import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Textarea } from '@shared/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTypingIndicator: (isTyping: boolean) => void;
  disabled?: boolean | undefined;
}

/**
 * Message input component
 *
 * Features:
 * - Textarea with enter to send (shift+enter for new line)
 * - Send button
 * - File upload button (placeholder for future implementation)
 * - Typing indicator debounce (1s)
 *
 * Usage:
 * ```tsx
 * <MessageInput
 *   onSendMessage={(content) => sendMessage(content)}
 *   onTypingIndicator={(isTyping) => sendTypingIndicator(isTyping)}
 * />
 * ```
 */
export function MessageInput({
  onSendMessage,
  onTypingIndicator,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing indicator with debounce
  const handleInputChange = (value: string) => {
    setMessage(value);

    // Send typing indicator
    if (value.length > 0) {
      onTypingIndicator(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 1s of no input
      typingTimeoutRef.current = setTimeout(() => {
        onTypingIndicator(false);
      }, 1000);
    } else {
      onTypingIndicator(false);
    }
  };

  // Handle send
  const handleSend = () => {
    if (message.trim().length === 0) return;

    onSendMessage(message.trim());
    setMessage('');
    onTypingIndicator(false);

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Handle Enter key (send on Enter, new line on Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-end gap-2 border-t p-4">
      {/* File upload button (placeholder) */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        onClick={() => {
          // TODO: Implement file upload in future
          console.log('File upload not yet implemented');
        }}
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      {/* Message textarea */}
      <Textarea
        value={message}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        rows={1}
        className="min-h-10 max-h-32 resize-none"
      />

      {/* Send button */}
      <Button
        type="button"
        onClick={handleSend}
        disabled={disabled || message.trim().length === 0}
        size="icon"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
