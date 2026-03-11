import { useEffect, useRef } from 'react';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { refreshToken as refreshTokenApi } from '@features/auth/api/authApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Decode JWT payload without verification
 * Used to check token expiry time
 */
function decodeJwt(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Auth provider to manage authentication state lifecycle
 *
 * Responsibilities:
 * 1. Hydrate auth state on app boot from localStorage refresh token
 * 2. Proactively refresh access token before it expires
 * 3. Handle refresh failures by logging out user
 *
 * Token refresh strategy:
 * - Checks token expiry every minute
 * - Refreshes if token will expire in < 5 minutes
 * - Prevents multiple simultaneous refresh attempts
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const getRefreshToken = useAuthStore((state) => state.getRefreshToken);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const setTokens = useAuthStore((state) => state.setTokens);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const isRefreshing = useRef(false);

  /**
   * Attempt to refresh access token
   */
  const attemptRefresh = async () => {
    if (isRefreshing.current) return;

    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) {
      logout();
      return;
    }

    try {
      isRefreshing.current = true;

      const response = await refreshTokenApi(storedRefreshToken);

      // Update tokens in store
      // Note: We don't have user data from refresh endpoint,
      // so we keep existing user (or it will be fetched separately)
      if (user) {
        setTokens(response.accessToken, response.refreshToken, user);
      } else {
        // If no user in store, we can't refresh properly
        // This shouldn't happen, but handle gracefully
        console.warn('Token refresh succeeded but no user in store');
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    } finally {
      isRefreshing.current = false;
    }
  };

  /**
   * Check if access token needs refresh
   * Returns true if token will expire in < 5 minutes
   */
  const shouldRefreshToken = (): boolean => {
    const accessToken = getAccessToken();
    if (!accessToken) return false;

    const payload = decodeJwt(accessToken);
    if (!payload?.exp) return false;

    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    const fiveMinutes = 5 * 60 * 1000;

    return timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0;
  };

  /**
   * Hydrate auth state on app boot
   */
  useEffect(() => {
    const storedRefreshToken = getRefreshToken();

    if (storedRefreshToken && !getAccessToken()) {
      // Refresh token exists but no access token
      // Attempt to refresh to restore session
      attemptRefresh();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Set up periodic token refresh check
   * Runs every minute to check if token needs refresh
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (shouldRefreshToken()) {
        attemptRefresh();
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [getAccessToken, getRefreshToken, user]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
