import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

/**
 * Authentication layout for login and OTP verification pages
 *
 * Features:
 * - Centered card with glass effect
 * - Premium gradient background
 * - Animated decorative blobs
 * - Logo and branding
 */
export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-auth px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl" />

      {/* Logo */}
      <Link to={ROUTES.HOME} className="relative mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
          <span className="text-2xl font-bold text-white">U</span>
        </div>
        <h1 className="text-3xl font-bold text-gradient">UPro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Freelance Marketplace</p>
      </Link>

      {/* Auth card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/60 bg-white/70 p-8 shadow-hover backdrop-blur-xl">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <p className="relative mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} UPro. All rights reserved.
      </p>
    </div>
  );
}
