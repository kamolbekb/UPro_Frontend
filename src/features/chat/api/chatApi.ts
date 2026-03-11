import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type {
  Conversation,
  Message,
  MessagesResponse,
  GetMessagesRequest,
  CreateConversationRequest,
} from '../types/chat.types';

/**
 * Get all conversations for current user
 *
 * Returns conversations with last message and unread count.
 *
 * @returns List of conversations
 */
export async function getConversations(): Promise<Conversation[]> {
  const response = await apiClient.get<Conversation[]>(ENDPOINTS.chat.conversations);
  return response.data;
}

/**
 * Get messages for a conversation with pagination
 *
 * @param request - Conversation ID and pagination params
 * @returns Paginated messages (50 per page by default)
 */
export async function getMessages(request: GetMessagesRequest): Promise<MessagesResponse> {
  const params = new URLSearchParams();

  if (request.page !== undefined) {
    params.append('page', request.page.toString());
  }
  if (request.limit !== undefined) {
    params.append('limit', request.limit.toString());
  }

  const url = `${ENDPOINTS.chat.messages(request.conversationId)}?${params.toString()}`;
  const response = await apiClient.get<MessagesResponse>(url);
  return response.data;
}

/**
 * Get or create conversation with a participant
 *
 * If conversation exists, returns existing one.
 * Otherwise, creates new conversation with optional initial message.
 *
 * @param request - Participant ID and optional initial message
 * @returns Conversation
 */
export async function getOrCreateConversation(
  request: CreateConversationRequest
): Promise<Conversation> {
  const response = await apiClient.post<Conversation>(
    ENDPOINTS.chat.conversations,
    request
  );
  return response.data;
}

/**
 * Send a message in a conversation
 *
 * Note: This is a fallback for HTTP-based sending.
 * Prefer using SignalR's SendMessage for real-time delivery.
 *
 * @param conversationId - Conversation ID
 * @param content - Message text
 * @returns Created message
 */
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<Message> {
  const response = await apiClient.post<Message>(ENDPOINTS.chat.sendMessage, {
    conversationId,
    content,
  });
  return response.data;
}

/**
 * Mark message as read
 *
 * @param messageId - Message ID to mark as read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.chat.markAsRead(messageId));
}
