import { Toaster } from 'react-hot-toast';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { SignalRProvider } from '@/app/providers/SignalRProvider';
import { AppRouter } from '@/app/router';
import { ErrorBoundary } from '@shared/components/errors/ErrorBoundary';

/**
 * Root application component
 *
 * Provider hierarchy:
 * 0. ErrorBoundary - Catches unhandled errors globally
 * 1. QueryProvider - TanStack Query client for server state
 * 2. AuthProvider - Authentication state hydration
 * 3. SignalRProvider - Real-time connection for chat
 * 4. Router - Application routing
 *
 * Global components:
 * - Toaster - Toast notifications from react-hot-toast
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <SignalRProvider>
            <AppRouter />
            <Toaster position="top-right" />
          </SignalRProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
