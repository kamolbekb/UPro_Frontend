import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCheck } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { NotificationItem } from './NotificationItem';
import { markAllAsRead } from '../api/notificationApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { Notification } from '../types/notification.types';

interface NotificationListProps {
  notifications: Notification[] | undefined;
  isLoading: boolean;
  onNotificationClick: (notification: Notification) => void;
}

/**
 * Notification list component
 *
 * Features:
 * - Scrollable list of notifications
 * - Mark all as read button
 * - Empty state
 * - Loading state
 *
 * Usage:
 * ```tsx
 * <NotificationList
 *   notifications={notifications}
 *   isLoading={isLoading}
 *   onNotificationClick={handleClick}
 * />
 * ```
 */
export function NotificationList({
  notifications,
  isLoading,
  onNotificationClick,
}: NotificationListProps) {
  const queryClient = useQueryClient();

  const { mutate: markAllRead, isPending: isMarkingAllRead } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      // Invalidate notifications to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const hasUnread = notifications?.some((n) => !n.isRead) ?? false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No Notifications"
          description="You're all caught up! Notifications will appear here."
        />
      </div>
    );
  }

  return (
    <div className="w-80">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Notifications</h3>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllRead()}
            disabled={isMarkingAllRead}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <ScrollArea className="h-96">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
