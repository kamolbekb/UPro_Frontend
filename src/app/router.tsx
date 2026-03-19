import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import { ROUTES, ROUTE_PATTERNS } from '@shared/constants/routes';
import { MainLayout } from '@shared/components/layout/MainLayout';
import { AuthLayout } from '@shared/components/layout/AuthLayout';
import { ProtectedRoute } from '@shared/components/guards/ProtectedRoute';
import { Button } from '@shared/components/ui/button';

// Auth Pages
import { LoginPage } from '@features/auth/pages/LoginPage';
import { OtpVerifyPage } from '@features/auth/pages/OtpVerifyPage';
import { CompleteProfilePage } from '@features/auth/pages/CompleteProfilePage';

// Home Page (unified tasks/executors view)
import { HomePage } from '@features/home/pages/HomePage';

// Task Pages
import { TaskDetailPage } from '@features/tasks/pages/TaskDetailPage';
import { CreateTaskPage } from '@features/tasks/pages/CreateTaskPage';

// Executor Pages
import { ExecutorProfilePage } from '@features/executors/pages/ExecutorProfilePage';
import { BecomeExecutorPage } from '@features/executors/pages/BecomeExecutorPage';

// Chat Pages
import { ChatPage } from '@features/chat/pages/ChatPage';

// My Tasks Page
import { MyTasksPage } from '@features/applications/pages/MyTasksPage';

// Profile Page
import { ProfilePage } from '@features/profile/pages/ProfilePage';

// Placeholder for pages not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <h1 className="mb-2 text-2xl font-bold">{title}</h1>
    <p className="text-muted-foreground">This page will be implemented in the next phases.</p>
  </div>
);

const SubscriptionsPage = () => <PlaceholderPage title="Subscriptions" />;

// 404 Page
function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <SearchX className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-1 text-xl font-semibold text-foreground">Page not found</p>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to={ROUTES.HOME}>
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}

/**
 * Application router configuration
 */
const router = createBrowserRouter([
  // Auth routes (public) — wrapped in AuthLayout (no navbar)
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.LOGIN_VERIFY,
        element: <OtpVerifyPage />,
      },
    ],
  },

  // Complete profile (standalone, no navbar)
  {
    path: ROUTES.COMPLETE_PROFILE,
    element: (
      <ProtectedRoute>
        <CompleteProfilePage />
      </ProtectedRoute>
    ),
  },

  // All main pages — wrapped in MainLayout (has navbar)
  {
    element: <MainLayout />,
    children: [
      // Home (public)
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.TASKS, element: <HomePage /> },
      { path: ROUTES.EXECUTORS, element: <HomePage /> },

      // Task routes
      {
        path: ROUTE_PATTERNS.TASK_DETAIL,
        element: (
          <ProtectedRoute>
            <TaskDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.TASK_NEW,
        element: (
          <ProtectedRoute>
            <CreateTaskPage />
          </ProtectedRoute>
        ),
      },

      // My Tasks (protected)
      {
        path: ROUTES.MY_TASKS,
        element: (
          <ProtectedRoute>
            <MyTasksPage />
          </ProtectedRoute>
        ),
      },

      // Executor routes
      { path: ROUTE_PATTERNS.EXECUTOR_PROFILE, element: <ExecutorProfilePage /> },
      {
        path: ROUTES.EXECUTOR_BECOME,
        element: (
          <ProtectedRoute>
            <BecomeExecutorPage />
          </ProtectedRoute>
        ),
      },

      // Chat routes (protected)
      {
        path: ROUTES.CHAT,
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATTERNS.CHAT_CONVERSATION,
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },

      // Profile (protected)
      {
        path: ROUTES.PROFILE,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      // Subscriptions (protected)
      {
        path: ROUTES.SUBSCRIPTIONS,
        element: (
          <ProtectedRoute>
            <SubscriptionsPage />
          </ProtectedRoute>
        ),
      },

      // 404 catch-all
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

/**
 * Router provider component to be used in App.tsx
 */
export function AppRouter() {
  return <RouterProvider router={router} />;
}
