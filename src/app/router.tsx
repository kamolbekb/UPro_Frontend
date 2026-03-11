import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ROUTES, ROUTE_PATTERNS } from '@shared/constants/routes';
import { AuthLayout } from '@shared/components/layout/AuthLayout';
// import { MainLayout } from '@shared/components/layout/MainLayout';
// import { ProtectedRoute } from '@shared/components/guards/ProtectedRoute';

// Auth Pages (Phase 3 - US1)
import { LoginPage } from '@features/auth/pages/LoginPage';
import { OtpVerifyPage } from '@features/auth/pages/OtpVerifyPage';

// Task Pages (Phase 4 - US2)
import { TasksPage } from '@features/tasks/pages/TasksPage';
import { TaskDetailPage } from '@features/tasks/pages/TaskDetailPage';

// Task Pages (Phase 5 - US3)
import { CreateTaskPage } from '@features/tasks/pages/CreateTaskPage';

// Executor Pages (Phase 6 - US4)
import { ExecutorsPage } from '@features/executors/pages/ExecutorsPage';
import { ExecutorProfilePage } from '@features/executors/pages/ExecutorProfilePage';
import { BecomeExecutorPage } from '@features/executors/pages/BecomeExecutorPage';

// Chat Pages (Phase 7 - US5)
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
  // Root redirect
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.TASKS} replace />,
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

  // Task routes (protected)
  {
    path: ROUTES.TASKS,
    element: <TasksPage />, // TODO: Wrap with ProtectedRoute + MainLayout in T026-T027
  },
  {
    path: ROUTE_PATTERNS.TASK_DETAIL,
    element: <TaskDetailPage />,
  },
  {
    path: ROUTES.TASK_NEW,
    element: <CreateTaskPage />,
  },

  // Executor routes (protected)
  {
    path: ROUTES.EXECUTORS,
    element: <ExecutorsPage />,
  },
  {
    path: ROUTE_PATTERNS.EXECUTOR_PROFILE,
    element: <ExecutorProfilePage />,
  },
  {
    path: ROUTES.EXECUTOR_BECOME,
    element: <BecomeExecutorPage />,
  },

  // Chat routes (protected)
  {
    path: ROUTES.CHAT,
    element: <ChatPage />,
  },
  {
    path: ROUTE_PATTERNS.CHAT_CONVERSATION,
    element: <ChatPage />,
  },

  // Profile routes (protected)
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
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
