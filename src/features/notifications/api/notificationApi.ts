import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type {
  NotificationsResponse,
  GetNotificationsRequest,
  RegisterTokenRequest,
} from '../types/notification.types';

/**
 * Get user notifications with pagination
 *
 * @param request - Pagination and filter params
 * @returns Paginated notifications with unread count
 */
export async function getNotifications(
  request: GetNotificationsRequest = {}
): Promise<NotificationsResponse> {
  const params = new URLSearchParams();

  if (request.page !== undefined) {
    params.append('page', request.page.toString());
  }
  if (request.limit !== undefined) {
    params.append('limit', request.limit.toString());
  }
  if (request.unreadOnly !== undefined) {
    params.append('unreadOnly', request.unreadOnly.toString());
  }

  const url = `${ENDPOINTS.notifications.list}?${params.toString()}`;
  const response = await apiClient.get<NotificationsResponse>(url);
  return response.data;
}

/**
 * Mark a notification as read
 *
 * @param notificationId - Notification UUID
 */
export async function markAsRead(notificationId: string): Promise<void> {
  await apiClient.post(ENDPOINTS.notifications.markRead(notificationId));
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<void> {
  await apiClient.post(ENDPOINTS.notifications.markAllRead);
}

/**
 * Get unread notification count
 *
 * @returns Unread count
 */
export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<{ count: number }>(
    ENDPOINTS.notifications.unreadCount
  );
  return response.data.count;
}

/**
 * Register FCM device token for push notifications
 *
 * @param request - FCM token and device type
 */
export async function registerToken(request: RegisterTokenRequest): Promise<void> {
  await apiClient.post(ENDPOINTS.notifications.registerToken, request);
}
