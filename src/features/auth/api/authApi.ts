import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type {
  SendOtpResponse,
  VerifyOtpResponse,
  RefreshTokenResponse,
  CompleteProfileRequest,
  CompleteProfileResponse,
  User,
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
 * Send OTP to user's email (InitiateLogin)
 *
 * @param email - User email address
 * @returns boolean (true on success, unwrapped from ApiResult<bool>)
 */
export async function sendOtp(
  email: string
): Promise<SendOtpResponse> {
  const response = await apiClient.post<SendOtpResponse>(
    ENDPOINTS.auth.sendOtp,
    { email }
  );
  return response.data;
}

/**
 * Resend OTP code to user's email
 *
 * @param email - User email address
 * @returns boolean (true on success)
 */
export async function resendOtp(
  email: string
): Promise<boolean> {
  const params = new URLSearchParams({ email });
  const response = await apiClient.post<boolean>(
    `${ENDPOINTS.auth.resendOtp}?${params.toString()}`
  );
  return response.data;
}

/**
 * Verify OTP code and authenticate user
 *
 * @param email - User email address
 * @param otpCode - 6-digit OTP code
 * @returns Login response with tokens
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
 * @param refreshTokenValue - Current refresh token
 * @returns New tokens (LoginResponseModel)
 */
export async function refreshToken(
  refreshTokenValue: string
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    ENDPOINTS.auth.refresh,
    { refreshToken: refreshTokenValue }
  );
  return response.data;
}

/**
 * Complete user profile (required after first login)
 *
 * @param data - First and last name
 * @returns Profile completion response
 */
export async function completeProfile(
  data: CompleteProfileRequest
): Promise<CompleteProfileResponse> {
  const response = await apiClient.post<CompleteProfileResponse>(
    ENDPOINTS.users.completeProfile,
    data
  );
  return response.data;
}

/**
 * Get current user auth data
 *
 * @returns User auth info (id, fullName, image, role)
 */
export async function getUserAuth(): Promise<User> {
  const response = await apiClient.get<User>(ENDPOINTS.users.userAuth);
  return response.data;
}
