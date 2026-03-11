import { type LucideIcon, Inbox } from 'lucide-react';
import { cn } from '@shared/utils/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Empty state component for lists and collections
 *
 * Displays a friendly message when no data is available.
 * Optionally includes a call-to-action button.
 *
 * Usage:
 * ```tsx
 * <EmptyState
 *   icon={FileText}
 *   title="No tasks found"
 *   description="Create your first task to get started"
 *   action={{ label: "Create Task", onClick: () => navigate('/tasks/new') }}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <Icon className="mb-4 h-16 w-16 text-muted-foreground/50" strokeWidth={1.5} />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
