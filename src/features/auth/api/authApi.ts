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
 * Send OTP to user's phone number
 *
 * @param phoneNumber - Phone number in E.164 format (+998XXXXXXXXX)
 * @returns OTP expiry time and success message
 *
 * @example
 * const result = await sendOtp('+998901234567');
 * // { expiresAt: '2024-03-10T12:30:00Z', message: 'OTP sent successfully' }
 */
export async function sendOtp(
  phoneNumber: string
): Promise<SendOtpResponse> {
  const request: SendOtpRequest = { phoneNumber };

  const response = await apiClient.post<SendOtpResponse>(
    ENDPOINTS.auth.sendOtp,
    request
  );

  return response.data;
}

/**
 * Verify OTP code and authenticate user
 *
 * @param phoneNumber - Phone number in E.164 format
 * @param code - 6-digit OTP code
 * @returns User data and authentication tokens
 *
 * @example
 * const result = await verifyOtp('+998901234567', '123456');
 * // { user: {...}, accessToken: '...', refreshToken: '...' }
 */
export async function verifyOtp(
  phoneNumber: string,
  code: string
): Promise<VerifyOtpResponse> {
  const request: VerifyOtpRequest = { phoneNumber, code };

  const response = await apiClient.post<VerifyOtpResponse>(
    ENDPOINTS.auth.verifyOtp,
    request
  );

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
  const request: RefreshTokenRequest = { refreshToken: refreshTokenValue };

  const response = await apiClient.post<RefreshTokenResponse>(
    ENDPOINTS.auth.refresh,
    request
  );

  return response.data;
}
