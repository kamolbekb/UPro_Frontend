import { Bell } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';
import { NotificationList } from './NotificationList';
import { useNotifications } from '../hooks/useNotifications';
import type { Notification } from '../types/notification.types';

interface NotificationBellProps {
  onNotificationClick: (notification: Notification) => void;
}

/**
 * Notification bell component
 *
 * Features:
 * - Bell icon with unread count badge
 * - Popover dropdown with notification list
 * - Auto-refresh every 30s
 *
 * Usage:
 * ```tsx
 * <NotificationBell
 *   onNotificationClick={(n) => navigate(getNotificationUrl(n))}
 * />
 * ```
 */
export function NotificationBell({ onNotificationClick }: NotificationBellProps) {
  const { data, isLoading } = useNotifications({ limit: 20 });

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <NotificationList
          notifications={data?.items}
          isLoading={isLoading}
          onNotificationClick={onNotificationClick}
        />
      </PopoverContent>
    </Popover>
  );
}
