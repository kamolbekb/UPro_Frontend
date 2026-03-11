import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { registerToken } from '../api/notificationApi';
import type { RegisterTokenRequest } from '../types/notification.types';

/**
 * Hook for registering FCM notification token
 *
 * Features:
 * - Registers device token with backend
 * - Shows success/error toast
 * - Handles registration errors gracefully
 *
 * Usage:
 * ```tsx
 * const { mutate: register } = useRegisterNotificationToken();
 * register({ token: fcmToken, deviceType: 'web' });
 * ```
 *
 * @returns Mutation object for token registration
 */
export function useRegisterNotificationToken() {
  return useMutation<void, Error, RegisterTokenRequest>({
    mutationFn: registerToken,
    onSuccess: () => {
      console.log('Notification token registered successfully');
    },
    onError: (error) => {
      console.error('Failed to register notification token:', error);
      toast.error('Failed to enable push notifications');
    },
  });
}
