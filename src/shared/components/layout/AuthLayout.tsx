import { Outlet } from 'react-router-dom';

/**
 * Authentication layout for login and OTP verification pages
 *
 * Features:
 * - Centered card design
 * - Full-height container with gradient background
 * - Logo and branding
 * - Responsive padding
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4">
      {/* Logo/Brand */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">UPro</h1>
        <p className="text-muted-foreground">Freelance Marketplace Platform</p>
      </div>

      {/* Auth card container */}
      <div className="w-full max-w-md">
        <div className="rounded-lg border bg-card p-8 shadow-lg">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} UPro. All rights reserved.</p>
      </div>
    </div>
  );
}
