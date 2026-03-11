import { useEffect, useState } from 'react';

/**
 * Hook for managing browser notification permission
 *
 * Features:
 * - Requests permission on mount (if not already granted/denied)
 * - Tracks current permission state
 * - Provides function to manually request permission
 *
 * Usage:
 * ```tsx
 * const { permission, requestPermission } = useNotificationPermission();
 * ```
 *
 * @returns Permission state and request function
 */
export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  });

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Browser notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  };

  // Request permission on mount if not already set
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      // Optionally auto-request permission on mount
      // Uncomment the line below to auto-request
      // requestPermission();
    }
  }, []);

  return {
    permission,
    requestPermission,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
  };
}
