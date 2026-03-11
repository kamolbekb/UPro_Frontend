import type { TypingIndicator as TypingIndicatorType } from '../types/chat.types';

interface TypingIndicatorProps {
  indicators: TypingIndicatorType[];
}

/**
 * Typing indicator component
 *
 * Features:
 * - Animated dots showing "{userName} is typing..."
 * - Supports multiple users typing simultaneously
 * - Auto-hidden when no one is typing
 *
 * Usage:
 * ```tsx
 * <TypingIndicator indicators={typingUsers} />
 * ```
 */
export function TypingIndicator({ indicators }: TypingIndicatorProps) {
  const activeTyping = indicators.filter((i) => i.isTyping);

  if (activeTyping.length === 0) {
    return null;
  }

  // Format typing users text
  const typingText =
    activeTyping.length === 1
      ? `${activeTyping[0]!.userName} is typing`
      : activeTyping.length === 2
        ? `${activeTyping[0]!.userName} and ${activeTyping[1]!.userName} are typing`
        : `${activeTyping[0]!.userName} and ${activeTyping.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
      <span>{typingText}</span>
      <div className="flex gap-1">
        <span className="animate-bounce animation-delay-0">•</span>
        <span className="animate-bounce animation-delay-100">•</span>
        <span className="animate-bounce animation-delay-200">•</span>
      </div>
    </div>
  );
}
