import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSignalR } from '@/app/providers/SignalRProvider';
import { useNotificationPermission } from './useNotificationPermission';
import { queryKeys } from '@shared/constants/queryKeys';
import type { Notification } from '../types/notification.types';

/**
 * Hook to listen for real-time notifications via SignalR
 *
 * Features:
 * - Listens for ReceiveNotification events
 * - Shows browser notification if app is in background
 * - Updates notification cache
 * - Auto-marks as read when clicked
 *
 * Usage:
 * ```tsx
 * useNotificationListener();
 * ```
 */
export function useNotificationListener() {
  const { connection } = useSignalR();
  const { permission } = useNotificationPermission();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connection) return;

    const handleReceiveNotification = (notification: Notification) => {
      // Update notification cache
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });

      // Show browser notification if permission granted and app not focused
      if (permission === 'granted' && document.hidden) {
        const browserNotification = new Notification(notification.title, {
          body: notification.body,
          icon: '/logo.png', // Update with actual logo path
          badge: '/badge.png', // Update with actual badge path
          tag: notification.id,
          data: {
            entityType: notification.entityType,
            entityId: notification.entityId,
            notificationId: notification.id,
          },
        });

        // Handle notification click
        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();

          // Navigate to relevant page based on entity type
          const baseUrl = window.location.origin;
          let targetUrl = baseUrl;

          if (notification.entityType && notification.entityId) {
            switch (notification.entityType) {
              case 'Task':
              case 'OrderTask':
                targetUrl = `${baseUrl}/tasks/${notification.entityId}`;
                break;
              case 'Chat':
              case 'Conversation':
                targetUrl = `${baseUrl}/chat/${notification.entityId}`;
                break;
              case 'Executor':
                targetUrl = `${baseUrl}/executors/${notification.entityId}`;
                break;
            }
          }

          window.location.href = targetUrl;
        };
      }
    };

    // Register SignalR event listener
    connection.on('ReceiveNotification', handleReceiveNotification);

    // Cleanup
    return () => {
      connection.off('ReceiveNotification', handleReceiveNotification);
    };
  }, [connection, permission, queryClient]);
}
