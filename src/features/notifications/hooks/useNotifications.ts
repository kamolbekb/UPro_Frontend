import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api/notificationApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { NotificationsResponse, GetNotificationsRequest } from '../types/notification.types';

/**
 * Hook for fetching notifications
 *
 * Features:
 * - Auto-refetch every 30 seconds
 * - Pagination support
 * - Unread count included in response
 *
 * Usage:
 * ```tsx
 * const { data, isLoading } = useNotifications({ unreadOnly: true });
 * ```
 *
 * @param request - Pagination and filter params
 * @returns Query object with notifications and unread count
 */
export function useNotifications(request: GetNotificationsRequest = {}) {
  return useQuery<NotificationsResponse>({
    queryKey: queryKeys.notifications.list(request),
    queryFn: () => getNotifications(request),
    // Auto-refetch every 30 seconds to keep notifications fresh
    refetchInterval: 30000,
  });
}
