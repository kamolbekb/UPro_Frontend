import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  CheckCircle,
  XCircle,
  MessageSquare,
  Briefcase,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import type { Notification, NotificationType } from '../types/notification.types';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

/**
 * Get icon for notification type
 */
function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'TaskCreated':
    case 'TaskAssigned':
      return <Briefcase className="h-5 w-5 text-blue-600" />;
    case 'TaskCompleted':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'TaskCancelled':
    case 'ApplicationRejected':
    case 'ExecutorRejected':
    case 'PaymentFailed':
      return <XCircle className="h-5 w-5 text-red-600" />;
    case 'MessageReceived':
      return <MessageSquare className="h-5 w-5 text-purple-600" />;
    case 'ApplicationReceived':
    case 'ApplicationAccepted':
    case 'ExecutorApproved':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'PaymentReceived':
      return <DollarSign className="h-5 w-5 text-green-600" />;
    case 'SystemAnnouncement':
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
}

/**
 * Notification item component
 *
 * Features:
 * - Type-specific icon
 * - Title and body display
 * - Time ago format
 * - Unread indicator
 * - Click handler for navigation
 *
 * Usage:
 * ```tsx
 * <NotificationItem
 *   notification={notification}
 *   onClick={(n) => navigate(getNotificationUrl(n))}
 * />
 * ```
 */
export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <div
      className={`cursor-pointer border-b p-4 transition-colors hover:bg-accent ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            {!notification.isRead && (
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {notification.body}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
