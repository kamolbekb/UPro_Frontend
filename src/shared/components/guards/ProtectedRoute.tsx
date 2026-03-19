import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { ROUTES } from '@shared/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Authentication guard component
 *
 * Waits for auth hydration to complete before checking authentication.
 * Redirects unauthenticated users to login page with return URL.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const location = useLocation();

  // Wait for auth hydration before making any redirect decisions
  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
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
