import { useEffect, useRef } from 'react';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { refreshToken as refreshTokenApi } from '@features/auth/api/authApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Decode JWT payload without verification
 */
function decodeJwt(token: string): Record<string, unknown> | null {
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
 * Check if a JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  const exp = payload?.exp;
  if (typeof exp !== 'number') return true;
  return Date.now() >= exp * 1000;
}

/**
 * Auth provider to manage authentication state lifecycle
 *
 * On page load:
 * - Access token is rehydrated from localStorage synchronously in the store
 * - This provider checks if it's valid or needs refreshing
 * - The expired access token is still sent as Authorization header for the refresh call
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const getRefreshToken = useAuthStore((state) => state.getRefreshToken);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const isRefreshing = useRef(false);

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
      setTokens(
        response.accessToken,
        response.refreshToken,
        response.id,
        response.isProfileCompleted
      );
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    } finally {
      isRefreshing.current = false;
    }
  };

  const shouldRefreshToken = (): boolean => {
    const accessToken = getAccessToken();
    if (!accessToken) return false;

    const payload = decodeJwt(accessToken);
    const exp = payload?.exp;
    if (typeof exp !== 'number') return false;

    const timeUntilExpiry = exp * 1000 - Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0;
  };

  /**
   * Hydrate auth state on app boot
   */
  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshTokenValue = getRefreshToken();

    if (accessToken && !isTokenExpired(accessToken)) {
      // Valid access token in localStorage — restore session immediately
      useAuthStore.setState({ isAuthenticated: true });
      setHydrated();
    } else if (refreshTokenValue) {
      // Access token missing or expired, but refresh token exists
      // The (possibly expired) access token is still in localStorage
      // and will be attached via the axios interceptor as Authorization header
      attemptRefresh().then(() => setHydrated());
    } else {
      // No tokens at all
      setHydrated();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Periodic token refresh check (every 60s)
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (shouldRefreshToken()) {
        attemptRefresh();
      }
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [getAccessToken, getRefreshToken, user]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
