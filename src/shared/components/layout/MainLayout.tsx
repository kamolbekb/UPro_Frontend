import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

/**
 * Main application layout
 *
 * Features:
 * - Top navigation bar with logo, links, notifications, profile
 * - Full-width content area below navbar
 * - Responsive design (no sidebar)
 */
export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
