import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type {
  Conversation,
  Message,
  MessagesResponse,
  GetMessagesRequest,
} from '../types/chat.types';

/**
 * Get all conversations for current user
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
 * @returns Paginated messages
 */
export async function getMessages(request: GetMessagesRequest): Promise<MessagesResponse> {
  const params = new URLSearchParams();

  if (request.page !== undefined) {
    params.append('page', request.page.toString());
  }
  if (request.limit !== undefined) {
    params.append('pageSize', request.limit.toString());
  }

  const url = `${ENDPOINTS.chat.messages(request.conversationId)}?${params.toString()}`;
  const response = await apiClient.get<MessagesResponse>(url);
  return response.data;
}

/**
 * Get or create conversation by task application ID
 * Backend creates conversation between task owner and executor via applicationId
 *
 * @param applicationId - Task application UUID
 * @returns Conversation
 */
export async function getOrCreateConversation(
  applicationId: string
): Promise<Conversation> {
  const response = await apiClient.post<Conversation>(
    ENDPOINTS.chat.createConversation(applicationId)
  );
  return response.data;
}

/**
 * Send a message in a conversation
 * Uses multipart/form-data to support file attachments
 *
 * @param conversationId - Conversation ID
 * @param content - Message text
 * @param attachments - Optional file attachments
 * @returns Created message
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  attachments?: File[]
): Promise<Message> {
  const formData = new FormData();
  if (content) {
    formData.append('content', content);
  }
  if (attachments) {
    attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const response = await apiClient.post<Message>(
    ENDPOINTS.chat.messages(conversationId),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

/**
 * Mark all messages in a conversation as read
 *
 * @param conversationId - Conversation ID
 */
export async function markMessagesAsRead(conversationId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.chat.markAsRead(conversationId));
}

/**
 * Get unread message count across all conversations
 *
 * @returns Unread count
 */
export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<number>(ENDPOINTS.chat.unreadCount);
  return response.data;
}
