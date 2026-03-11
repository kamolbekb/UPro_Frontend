import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Users } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { TasksPage } from '@features/tasks/pages/TasksPage';
import { ExecutorsPage } from '@features/executors/pages/ExecutorsPage';
import { ROUTES } from '@shared/constants/routes';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';

type ViewMode = 'tasks' | 'executors';

/**
 * HomePage - Unified view for browsing tasks and executors
 *
 * Features:
 * - Toggle between tasks and executors views
 * - Create Task button (redirects to login if not authenticated)
 * - Responsive layout
 */
export function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [viewMode, setViewMode] = useState<ViewMode>('tasks');

  /**
   * Handle create task button click
   * Redirects to login if not authenticated
   */
  const handleCreateTask = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { returnUrl: ROUTES.TASK_NEW } });
    } else {
      navigate(ROUTES.TASK_NEW);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Page Header with Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">
            {viewMode === 'tasks' ? 'Browse Tasks' : 'Find Executors'}
          </h1>

          {/* View Toggle */}
          <div className="flex gap-2 rounded-lg border bg-muted p-1">
            <button
              onClick={() => setViewMode('tasks')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'tasks'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Tasks
            </button>
            <button
              onClick={() => setViewMode('executors')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'executors'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="h-4 w-4" />
              Executors
            </button>
          </div>
        </div>

        {/* Create Task Button - Only visible in tasks view */}
        {viewMode === 'tasks' && (
          <Button onClick={handleCreateTask} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Task
          </Button>
        )}
      </div>

      {/* Description */}
      <p className="mb-6 text-gray-600">
        {viewMode === 'tasks'
          ? 'Find freelance opportunities that match your skills'
          : 'Browse skilled professionals ready to help with your tasks'}
      </p>

      {/* Content */}
      {viewMode === 'tasks' ? (
        <TasksPageContent />
      ) : (
        <ExecutorsPageContent />
      )}
    </div>
  );
}

/**
 * TasksPageContent - Renders task list without header
 */
function TasksPageContent() {
  // Import the task list logic from TasksPage but without the header
  // For now, we'll just render the TasksPage and hide its header with CSS
  return (
    <div className="[&>div]:!pt-0 [&>div>div:first-child]:!hidden [&>div>div:nth-child(2)]:!hidden">
      <TasksPage />
    </div>
  );
}

/**
 * ExecutorsPageContent - Renders executor list without header
 */
function ExecutorsPageContent() {
  // Import the executor list logic from ExecutorsPage but without the header
  return (
    <div className="[&>div]:!pt-0 [&>div>div:first-child]:!hidden [&>div>div:nth-child(2)]:!hidden">
      <ExecutorsPage />
    </div>
  );
}
