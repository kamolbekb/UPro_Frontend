import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sendOtp } from '../api/authApi';
import type { SendOtpResponse } from '../types/auth.types';

/**
 * Hook for sending OTP to user's phone number
 *
 * Handles the first step of authentication:
 * 1. User enters phone number
 * 2. Backend sends OTP via SMS
 * 3. User is shown OTP verification form
 *
 * Success callback typically navigates to OTP verification page.
 *
 * @example
 * ```tsx
 * const login = useLogin();
 *
 * const handleSubmit = (phoneNumber: string) => {
 *   login.mutate(phoneNumber, {
 *     onSuccess: () => navigate('/login/verify', { state: { phoneNumber } })
 *   });
 * };
 * ```
 */
export function useLogin() {
  return useMutation<SendOtpResponse, Error, string>({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      // Show success toast with OTP expiry information
      const expiryDate = new Date(data.expiresAt);
      const minutes = Math.ceil(
        (expiryDate.getTime() - Date.now()) / (1000 * 60)
      );

      toast.success(
        `OTP sent successfully! Code expires in ${minutes} minute${minutes !== 1 ? 's' : ''}.`,
        { duration: 4000 }
      );
    },
    onError: (error) => {
      // Error toast is handled by global mutation default in QueryProvider
      // But we can add custom error handling here if needed
      console.error('Failed to send OTP:', error);
    },
  });
}
