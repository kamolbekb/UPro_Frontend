import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { verifyOtp } from '../api/authApi';
import { useAuthStore } from './useAuthStore';
import { ROUTES } from '@/shared/constants/routes';
import type { VerifyOtpResponse } from '../types/auth.types';

/**
 * Request parameters for OTP verification
 */
interface VerifyOtpParams {
  email: string;
  code: string;
}

/**
 * Hook for verifying OTP and authenticating user
 *
 * Handles the second step of authentication:
 * 1. User enters 6-digit OTP code
 * 2. Backend verifies code and returns tokens
 * 3. Tokens are stored in auth store
 * 4. User is navigated to tasks page
 *
 * @example
 * ```tsx
 * const verifyOtpMutation = useVerifyOtp();
 *
 * const handleSubmit = (code: string) => {
 *   verifyOtpMutation.mutate({ email, code });
 * };
 * ```
 */
export function useVerifyOtp() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation<VerifyOtpResponse, Error, VerifyOtpParams>({
    mutationFn: ({ email, code }) => verifyOtp(email, code),
    onSuccess: (data) => {
      // Store authentication tokens
      setTokens(data.accessToken, data.refreshToken, data.id, data.isProfileCompleted);

      // Show success message
      toast.success('Successfully logged in!', { duration: 3000 });

      // Navigate to tasks page (or return URL if provided)
      navigate(ROUTES.TASKS, { replace: true });
    },
    onError: (error) => {
      // Error toast is handled by global mutation default
      // Log for debugging
      console.error('OTP verification failed:', error);
    },
  });
}
