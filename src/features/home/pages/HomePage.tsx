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
 */
export function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [viewMode, setViewMode] = useState<ViewMode>('tasks');

  const handleCreateTask = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { returnUrl: ROUTES.TASK_NEW } });
    } else {
      navigate(ROUTES.TASK_NEW);
    }
  };

  return (
    <div className="animate-in">
      {/* Hero Section */}
      <div className="bg-gradient-hero">
        <div className="container mx-auto max-w-7xl px-4 pb-8 pt-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {viewMode === 'tasks' ? (
                  <>Browse <span className="text-gradient">Tasks</span></>
                ) : (
                  <>Find <span className="text-gradient">Executors</span></>
                )}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {viewMode === 'tasks'
                  ? 'Find freelance opportunities that match your skills'
                  : 'Browse skilled professionals ready to help with your tasks'}
              </p>
            </div>

            {viewMode === 'tasks' && (
              <Button
                onClick={handleCreateTask}
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Task
              </Button>
            )}
          </div>

          {/* View Toggle */}
          <div className="inline-flex rounded-xl border bg-white/60 p-1 shadow-soft backdrop-blur-sm">
            <button
              onClick={() => setViewMode('tasks')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                viewMode === 'tasks'
                  ? 'bg-white text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Tasks
            </button>
            <button
              onClick={() => setViewMode('executors')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                viewMode === 'executors'
                  ? 'bg-white text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="h-4 w-4" />
              Executors
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {viewMode === 'tasks' ? (
          <div className="[&>div]:!pt-0 [&>div>div:first-child]:!hidden [&>div>div:nth-child(2)]:!hidden">
            <TasksPage />
          </div>
        ) : (
          <div className="[&>div]:!pt-0 [&>div>div:first-child]:!hidden [&>div>div:nth-child(2)]:!hidden">
            <ExecutorsPage />
          </div>
        )}
      </div>
    </div>
  );
}
