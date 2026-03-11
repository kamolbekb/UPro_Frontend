import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';
import { NotificationBell } from '@features/notifications/components/NotificationBell';
import { useNotificationListener } from '@features/notifications/hooks/useNotificationListener';
import type { Notification } from '@features/notifications/types/notification.types';

/**
 * Main application layout for authenticated pages
 *
 * Features:
 * - Top navigation bar with app logo and notification bell
 * - Left sidebar with main navigation links
 * - Content area with Outlet for nested routes
 * - Notification click navigation to relevant pages
 * - Real-time browser notifications
 */
export function MainLayout() {
  const navigate = useNavigate();

  // Listen for real-time notifications
  useNotificationListener();

  /**
   * Handle notification click - navigate to relevant page based on entity type
   */
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.entityType || !notification.entityId) {
      return;
    }

    // Navigate based on entity type
    switch (notification.entityType) {
      case 'Task':
      case 'OrderTask':
        navigate(ROUTES.TASK_DETAIL(notification.entityId));
        break;
      case 'Chat':
      case 'Conversation':
        navigate(ROUTES.CHAT_CONVERSATION(notification.entityId));
        break;
      case 'Executor':
        navigate(ROUTES.EXECUTOR_PROFILE(notification.entityId));
        break;
      default:
        console.log('Unknown notification entity type:', notification.entityType);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <span className="text-2xl font-bold">UPro</span>
          </Link>

          {/* Right side - Notifications */}
          <div className="flex items-center space-x-4">
            <NotificationBell onNotificationClick={handleNotificationClick} />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background">
          <nav className="flex flex-col space-y-1 p-4">
            <Link
              to={ROUTES.TASKS}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Tasks
            </Link>
            <Link
              to={ROUTES.EXECUTORS}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Executors
            </Link>
            <Link
              to={ROUTES.CHAT}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Chat
            </Link>
            <Link
              to={ROUTES.PROFILE}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Profile
            </Link>

            {/* Divider */}
            <div className="my-2 border-t" />

            {/* Action Links */}
            <Link
              to={ROUTES.EXECUTOR_BECOME}
              className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground"
            >
              Become Executor
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
