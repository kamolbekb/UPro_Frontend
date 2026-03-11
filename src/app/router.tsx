import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ROUTES, ROUTE_PATTERNS } from '@shared/constants/routes';
import { AuthLayout } from '@shared/components/layout/AuthLayout';
import { ProtectedRoute } from '@shared/components/guards/ProtectedRoute';

// Auth Pages
import { LoginPage } from '@features/auth/pages/LoginPage';
import { OtpVerifyPage } from '@features/auth/pages/OtpVerifyPage';

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

// Placeholder components (will be replaced with actual pages in future phases)
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem' }}>
    <h1>{title}</h1>
    <p>This page will be implemented in the next phases.</p>
  </div>
);

// Profile Pages
const ProfilePage = () => <PlaceholderPage title="My Profile" />;

// Error Pages
const NotFoundPage = () => <PlaceholderPage title="404 - Not Found" />;

/**
 * Application router configuration
 */
const router = createBrowserRouter([
  // Root redirect to home page
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },

  // Auth routes (public) - wrapped in AuthLayout
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

  // Home routes (public - shows tasks/executors)
  {
    path: ROUTES.TASKS,
    element: <HomePage />,
  },
  {
    path: ROUTES.EXECUTORS,
    element: <HomePage />,
  },

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

  // Executor routes
  {
    path: ROUTE_PATTERNS.EXECUTOR_PROFILE,
    element: <ExecutorProfilePage />,
  },
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

  // Profile routes (protected)
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },

  // 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

/**
 * Router provider component to be used in App.tsx
 */
export function AppRouter() {
  return <RouterProvider router={router} />;
}
