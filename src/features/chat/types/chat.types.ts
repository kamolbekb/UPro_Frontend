/**
 * Chat feature type definitions
 *
 * Includes types for:
 * - Conversations (chat rooms)
 * - Messages (text, attachments, metadata)
 * - Typing indicators
 * - Message attachments
 */

/**
 * Conversation/Chat room
 */
export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantImage: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  createdAt: string;
}

/**
 * Chat message
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage: string | null;
  content: string;
  attachments: MessageAttachment[];
  isRead: boolean;
  createdAt: string;
}

/**
 * Message attachment (file/image)
 */
export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  thumbnailUrl?: string | undefined;
}

/**
 * Typing indicator state
 */
export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
  timestamp: number;
}

/**
 * Send message request
 */
export interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachments?: File[] | undefined;
}

/**
 * Create conversation request
 */
export interface CreateConversationRequest {
  participantId: string;
  initialMessage?: string | undefined;
}

/**
 * Get messages filters
 */
export interface GetMessagesRequest {
  conversationId: string;
  page?: number | undefined;
  limit?: number | undefined;
}

/**
 * Paginated messages response
 */
export interface MessagesResponse {
  items: Message[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * SignalR event payloads
 */
export interface ReceiveMessageEvent {
  message: Message;
}

export interface UserTypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
}

export interface MessageReadEvent {
  conversationId: string;
  messageId: string;
  readBy: string;
}
