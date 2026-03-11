import { create } from 'zustand';
import type { User } from '../types/auth.types';

/**
 * Authentication Zustand store
 *
 * Manages authentication state including tokens and user data.
 *
 * Security considerations:
 * - accessToken stored in memory only (not persisted) for security
 * - refreshToken stored in localStorage (see T044 for persistence logic)
 * - Tokens cleared on logout
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, user, setTokens, logout } = useAuthStore();
 * ```
 */

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;

  // Computed
  isAuthenticated: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

/**
 * localStorage key for refresh token
 * NOTE: refreshToken persistence will be fully implemented in T044
 */
const REFRESH_TOKEN_KEY = 'upro_refresh_token';

/**
 * Get refresh token from localStorage
 */
const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    // localStorage might be unavailable (SSR, private browsing)
    return null;
  }
};

/**
 * Store refresh token in localStorage
 */
const setStoredRefreshToken = (token: string): void => {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch {
    // Silently fail if localStorage unavailable
    console.warn('Failed to persist refresh token');
  }
};

/**
 * Clear refresh token from localStorage
 */
const clearStoredRefreshToken = (): void => {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Silently fail
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  isAuthenticated: false,

  // Actions
  setTokens: (accessToken: string, refreshToken: string, user: User) => {
    // Store refreshToken in localStorage
    setStoredRefreshToken(refreshToken);

    // Update state
    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: () => {
    // Clear tokens from storage
    clearStoredRefreshToken();

    // Reset state
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  getAccessToken: () => {
    return get().accessToken;
  },

  getRefreshToken: () => {
    return getStoredRefreshToken();
  },
}));
