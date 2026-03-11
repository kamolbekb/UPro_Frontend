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
  phoneNumber: string;
  firstName?: string | null;
  lastName?: string | null;
  image?: string | null;
  birthDate?: string | null;
  isExecutor: boolean;
  createdAt: string;
}

/**
 * Authenticated user with tokens
 */
export interface AuthenticatedUser {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Request body for sending OTP
 */
export interface SendOtpRequest {
  phoneNumber: string;
}

/**
 * Response from send OTP endpoint
 */
export interface SendOtpResponse {
  expiresAt: string; // ISO timestamp when OTP expires
  message: string;
}

/**
 * Request body for verifying OTP
 */
export interface VerifyOtpRequest {
  phoneNumber: string;
  code: string;
}

/**
 * Response from verify OTP endpoint
 */
export interface VerifyOtpResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
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
}

/**
 * Auth state shape for Zustand store
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}
