import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  Users,
  MessageSquare,
  User,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { NotificationBell } from '@features/notifications/components/NotificationBell';
import { useNotificationListener } from '@features/notifications/hooks/useNotificationListener';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';
import type { Notification } from '@features/notifications/types/notification.types';

const NAV_LINKS = [
  { label: 'Home', path: ROUTES.HOME, icon: Home, auth: false },
  { label: 'My Tasks', path: ROUTES.MY_TASKS, icon: ClipboardList, auth: true },
  { label: 'Executors', path: ROUTES.EXECUTORS, icon: Users, auth: false },
  { label: 'Chat', path: ROUTES.CHAT, icon: MessageSquare, auth: true },
] as const;

/**
 * Main navigation bar — sticky top, responsive
 */
export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  useNotificationListener();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.entityType || !notification.entityId) return;

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
    }
  };

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === '/' || location.pathname === '/tasks';
    }
    return location.pathname.startsWith(path);
  };

  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.auth || isAuthenticated
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-sm font-bold text-white">U</span>
          </div>
          <span className="text-xl font-bold text-gradient">UPro</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NotificationBell onNotificationClick={handleNotificationClick} />
              <Link
                to={ROUTES.PROFILE}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition-all',
                  isActive(ROUTES.PROFILE)
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'hover:ring-2 hover:ring-muted hover:ring-offset-1'
                )}
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </Link>
            </>
          ) : (
            <Button
              onClick={() =>
                navigate(ROUTES.LOGIN, {
                  state: { returnUrl: location.pathname },
                })
              }
              size="sm"
              className="bg-gradient-primary hover:opacity-90"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="animate-slide-down border-t bg-white px-4 pb-4 pt-2 md:hidden">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
