import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  userId: string | null;
  isProfileCompleted: boolean;
  isHydrated: boolean;

  // Computed
  isAuthenticated: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string, userId: string, isProfileCompleted: boolean) => void;
  setUser: (user: User) => void;
  setProfileCompleted: (completed: boolean) => void;
  setHydrated: () => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const REFRESH_TOKEN_KEY = 'upro_refresh_token';
const ACCESS_TOKEN_KEY = 'upro_access_token';

const getStoredToken = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStoredToken = (key: string, token: string): void => {
  try {
    localStorage.setItem(key, token);
  } catch {
    console.warn('Failed to persist token');
  }
};

const clearStoredTokens = (): void => {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Silently fail
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state — rehydrate access token from localStorage
  user: null,
  accessToken: getStoredToken(ACCESS_TOKEN_KEY),
  userId: null,
  isProfileCompleted: false,
  isAuthenticated: false,
  isHydrated: false,

  // Actions
  setTokens: (accessToken: string, refreshToken: string, userId: string, isProfileCompleted: boolean) => {
    setStoredToken(REFRESH_TOKEN_KEY, refreshToken);
    setStoredToken(ACCESS_TOKEN_KEY, accessToken);

    set({
      accessToken,
      userId,
      isProfileCompleted,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => {
    set({
      user,
      isProfileCompleted: user.isProfileCompleted ?? false,
    });
  },

  setProfileCompleted: (completed: boolean) => {
    set({ isProfileCompleted: completed });
  },

  setHydrated: () => {
    set({ isHydrated: true });
  },

  logout: () => {
    clearStoredTokens();

    set({
      user: null,
      accessToken: null,
      userId: null,
      isProfileCompleted: false,
      isAuthenticated: false,
    });
  },

  getAccessToken: () => {
    return get().accessToken;
  },

  getRefreshToken: () => {
    return getStoredToken(REFRESH_TOKEN_KEY);
  },
}));
