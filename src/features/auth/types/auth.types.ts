/**
 * Authentication type definitions
 *
 * Defines all authentication-related types for the UPro frontend.
 * Note: All API responses are unwrapped from ApiResult<T> by the interceptor,
 * so types here represent the `result` field only.
 */

/**
 * User data returned from backend (UserAuthResponseModel)
 */
export interface User {
  id: string;
  code?: string;
  fullName?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  image?: string | null;
  role?: number; // 1=Admin, 2=User, 3=Executor
  isProfileCompleted?: boolean;
}

/**
 * Request body for sending OTP
 */
export interface SendOtpRequest {
  email: string;
}

/**
 * Response from send OTP endpoint (InitiateLogin)
 * Backend returns ApiResult<bool>, interceptor unwraps to boolean
 */
export type SendOtpResponse = boolean;

/**
 * Request body for verifying OTP
 */
export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

/**
 * Response from verify OTP endpoint (LoginResponseModel)
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
 * Response from refresh token endpoint (LoginResponseModel)
 */
export interface RefreshTokenResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
  isProfileCompleted: boolean;
}

/**
 * Request body for completing profile
 */
export interface CompleteProfileRequest {
  firstName: string;
  lastName: string;
}

/**
 * Response from complete profile endpoint
 */
export interface CompleteProfileResponse {
  id: string;
  isProfileCompleted: boolean;
}

/**
 * Full user profile from GetCurrentUser (UserApplicationResponseModel)
 */
export interface UserProfile {
  id: string;
  email: string;
  code: string;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
  isExecutor: boolean;
  role: number; // 0=User, 1=Admin
}

/**
 * Request body for updating user profile
 */
export interface UpdateMyProfileRequest {
  firstName: string;
  lastName: string;
  image?: File;
}

/**
 * Auth state shape for Zustand store
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isProfileCompleted: boolean;
  setTokens: (accessToken: string, refreshToken: string, userId: string, isProfileCompleted: boolean) => void;
  setUser: (user: User) => void;
  setProfileCompleted: (completed: boolean) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}
