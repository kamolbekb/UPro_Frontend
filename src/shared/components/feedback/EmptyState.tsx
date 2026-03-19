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
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all hover:opacity-90 hover:shadow-hover"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
