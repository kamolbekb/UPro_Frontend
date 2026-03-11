/**
 * Notification feature type definitions
 *
 * Includes types for:
 * - Notifications (in-app and browser)
 * - Notification types/categories
 * - FCM token registration
 */

/**
 * Notification type enum
 */
export enum NotificationType {
  TASK_CREATED = 'TaskCreated',
  TASK_ASSIGNED = 'TaskAssigned',
  TASK_COMPLETED = 'TaskCompleted',
  TASK_CANCELLED = 'TaskCancelled',
  APPLICATION_RECEIVED = 'ApplicationReceived',
  APPLICATION_ACCEPTED = 'ApplicationAccepted',
  APPLICATION_REJECTED = 'ApplicationRejected',
  MESSAGE_RECEIVED = 'MessageReceived',
  EXECUTOR_APPROVED = 'ExecutorApproved',
  EXECUTOR_REJECTED = 'ExecutorRejected',
  PAYMENT_RECEIVED = 'PaymentReceived',
  PAYMENT_FAILED = 'PaymentFailed',
  SYSTEM_ANNOUNCEMENT = 'SystemAnnouncement',
}

/**
 * Notification entity
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  entityType?: string | undefined;
  entityId?: string | undefined;
  isRead: boolean;
  createdAt: string;
}

/**
 * Get notifications request filters
 */
export interface GetNotificationsRequest {
  page?: number | undefined;
  limit?: number | undefined;
  unreadOnly?: boolean | undefined;
}

/**
 * Paginated notifications response
 */
export interface NotificationsResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Register FCM token request
 */
export interface RegisterTokenRequest {
  token: string;
  deviceType: 'web' | 'mobile';
}

/**
 * Browser notification options
 */
export interface BrowserNotificationOptions {
  title: string;
  body: string;
  icon?: string | undefined;
  badge?: string | undefined;
  tag?: string | undefined;
  data?: Record<string, unknown> | undefined;
}
