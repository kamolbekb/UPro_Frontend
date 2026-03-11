import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/auth.types';

/**
 * Authentication API functions
 *
 * All functions use the shared apiClient which:
 * - Automatically unwraps ApiResult<T> responses
 * - Handles errors and normalizes to ApiError
 * - Attaches auth tokens via interceptors
 */

/**
 * Send OTP to user's email/phone
 *
 * @param email - User email or phone number
 * @returns OTP expiry time and success message
 *
 * @example
 * const result = await sendOtp('user@example.com');
 * // { expiresAt: '2024-03-10T12:30:00Z', message: 'OTP sent successfully' }
 */
export async function sendOtp(
  email: string
): Promise<SendOtpResponse> {
  const request = { email };

  const response = await apiClient.post<SendOtpResponse>(
    ENDPOINTS.auth.sendOtp,
    request
  );

  return response.data;
}

/**
 * Verify OTP code and authenticate user
 *
 * @param email - User email or phone number
 * @param otpCode - 6-digit OTP code
 * @returns User data and authentication tokens
 *
 * @example
 * const result = await verifyOtp('user@example.com', '123456');
 * // { user: {...}, accessToken: '...', refreshToken: '...' }
 */
export async function verifyOtp(
  email: string,
  otpCode: string
): Promise<VerifyOtpResponse> {
  const params = new URLSearchParams({ email, otpCode });
  const url = `${ENDPOINTS.auth.verifyOtp}?${params.toString()}`;

  const response = await apiClient.post<VerifyOtpResponse>(url);

  return response.data;
}

/**
 * Refresh access token using refresh token
 *
 * This function is called automatically by the API client's 401 interceptor
 * when the access token expires. Can also be called proactively.
 *
 * @param refreshTokenValue - Current refresh token
 * @returns New access token and refresh token pair
 *
 * @example
 * const tokens = await refreshToken('current-refresh-token');
 * // { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' }
 */
export async function refreshToken(
  refreshTokenValue: string
): Promise<RefreshTokenResponse> {
  const request = { refreshToken: refreshTokenValue };

  const response = await apiClient.post<RefreshTokenResponse>(
    ENDPOINTS.auth.refresh,
    request
  );

  return response.data;
}
