import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sendOtp } from '../api/authApi';
import type { SendOtpResponse } from '../types/auth.types';

/**
 * Hook for sending OTP to user's email
 *
 * Handles the first step of authentication:
 * 1. User enters email
 * 2. Backend sends OTP via email
 * 3. User is shown OTP verification form
 *
 * Success callback typically navigates to OTP verification page.
 *
 * @example
 * ```tsx
 * const login = useLogin();
 *
 * const handleSubmit = (email: string) => {
 *   login.mutate(email, {
 *     onSuccess: () => navigate('/login/verify', { state: { email } })
 *   });
 * };
 * ```
 */
export function useLogin() {
  return useMutation<SendOtpResponse, Error, string>({
    mutationFn: sendOtp,
    onSuccess: () => {
      // Show success toast
      toast.success(
        'OTP sent successfully! Check your email for the verification code.',
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
