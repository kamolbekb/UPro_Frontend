/**
 * Authentication type definitions
 *
 * Defines all authentication-related types for the UPro frontend
 */

/**
 * User data returned from backend
 */
export interface User {
  id: string;
  email: string;
  code?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  image?: string | null;
  role?: number;
  isProfileCompleted?: boolean;
}

/**
 * Authenticated user with tokens
 */
export interface AuthenticatedUser {
  id: string;
  accessToken: string;
  refreshToken: string;
  isProfileCompleted: boolean;
}

/**
 * Request body for sending OTP
 */
export interface SendOtpRequest {
  email: string;
}

/**
 * Response from send OTP endpoint (InitiateLogin)
 */
export interface SendOtpResponse {
  succeeded: boolean;
  result: boolean;
  errors: string[];
}

/**
 * Request body for verifying OTP
 */
export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

/**
 * Response from verify OTP endpoint
 */
export interface VerifyOtpResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
  isProfileCompleted: boolean;
}

/**
 * Request body for refreshing tokens
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Response from refresh token endpoint
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  isProfileCompleted?: boolean;
}

/**
 * Auth state shape for Zustand store
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isProfileCompleted: boolean;
  setTokens: (accessToken: string, refreshToken: string, userId: string, isProfileCompleted: boolean) => void;
  setUser: (user: User) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}
