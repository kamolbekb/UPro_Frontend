import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { ROUTES } from '@shared/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Authentication guard component
 *
 * Redirects unauthenticated users to login page
 * with return URL to come back after login
 *
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <CreateTaskPage />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ returnUrl: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}
