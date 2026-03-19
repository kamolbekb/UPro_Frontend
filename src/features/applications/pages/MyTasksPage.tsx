import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ClipboardList, Plus } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Skeleton } from '@shared/components/ui/skeleton';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { useCreatorTasks, useExecutorTasks } from '../hooks/useApplications';
import { CreatorTaskCard } from '../components/CreatorTaskCard';
import { ExecutorTaskCard } from '../components/ExecutorTaskCard';
import { ROUTES } from '@shared/constants/routes';

type TabMode = 'creator' | 'executor';

const STATUS_FILTERS = [
  { label: 'All', value: 0 },
  { label: 'Applied', value: 1 },
  { label: 'Accepted', value: 3 },
  { label: 'Completed', value: 4 },
  { label: 'Rejected', value: 5 },
] as const;

/**
 * MyTasks page — dashboard for task creators and executors
 */
export function MyTasksPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabMode>('creator');

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="bg-gradient-hero">
        <div className="container mx-auto max-w-7xl px-4 pb-8 pt-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {tab === 'creator' ? (
                  <>My <span className="text-gradient">Tasks</span></>
                ) : (
                  <>My <span className="text-gradient">Applications</span></>
                )}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {tab === 'creator'
                  ? 'Manage tasks you have created and review applications'
                  : 'Track the status of tasks you have applied to'}
              </p>
            </div>

            {tab === 'creator' && (
              <Button
                onClick={() => navigate(ROUTES.TASK_NEW)}
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Task
              </Button>
            )}
          </div>

          {/* Tab Toggle */}
          <div className="inline-flex rounded-xl border bg-white/60 p-1 shadow-soft backdrop-blur-sm">
            <button
              onClick={() => setTab('creator')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                tab === 'creator'
                  ? 'bg-white text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              My Tasks
            </button>
            <button
              onClick={() => setTab('executor')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                tab === 'executor'
                  ? 'bg-white text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              My Applications
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {tab === 'creator' ? <CreatorTasksTab /> : <ExecutorTasksTab />}
      </div>
    </div>
  );
}

/**
 * Creator tab - shows tasks the user created
 */
function CreatorTasksTab() {
  const navigate = useNavigate();
  const { data: tasks, isLoading, isError } = useCreatorTasks();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load tasks"
        description="Something went wrong. Please try again later."
      />
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="No tasks yet"
        description="Create your first task to get started"
        action={{
          label: 'Create Task',
          onClick: () => navigate(ROUTES.TASK_NEW),
        }}
      />
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <CreatorTaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  );
}

/**
 * Executor tab - shows tasks the user applied to with status filter
 */
function ExecutorTasksTab() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState(0);
  const { data: tasks, isLoading, isError } = useExecutorTasks(statusFilter);

  return (
    <>
      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              statusFilter === filter.value
                ? 'bg-primary text-white shadow-soft'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {isError && (
        <EmptyState
          title="Failed to load applications"
          description="Something went wrong. Please try again later."
        />
      )}

      {!isLoading && !isError && (!tasks || tasks.length === 0) && (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Browse available tasks and apply to get started"
          action={{
            label: 'Browse Tasks',
            onClick: () => navigate(ROUTES.TASKS),
          }}
        />
      )}

      {!isLoading && tasks && tasks.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {tasks.length} application{tasks.length !== 1 ? 's' : ''}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <ExecutorTaskCard key={task.id} task={task} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
