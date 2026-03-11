import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { ROUTES } from '@shared/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that redirects unauthenticated users to login
 *
 * Preserves the intended destination in location state for post-login redirect.
 *
 * Usage:
 * ```tsx
 * <Route path="/tasks" element={
 *   <ProtectedRoute>
 *     <TasksPage />
 *   </ProtectedRoute>
 * } />
 * ```
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
