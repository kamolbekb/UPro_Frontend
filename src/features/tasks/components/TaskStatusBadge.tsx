import { Badge } from '@shared/components/ui/badge';
import { TaskStatus } from '../types/task.types';

export interface TaskStatusBadgeProps {
  status: TaskStatus;
}

/**
 * Task status badge with color coding
 *
 * Maps task status to appropriate badge variant and display text.
 */
export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const getStatusConfig = (taskStatus: TaskStatus) => {
    switch (taskStatus) {
      case TaskStatus.Draft:
        return {
          label: 'Draft',
          variant: 'secondary' as const,
        };
      case TaskStatus.Published:
        return {
          label: 'Open',
          variant: 'default' as const,
        };
      case TaskStatus.InProgress:
        return {
          label: 'In Progress',
          variant: 'default' as const,
        };
      case TaskStatus.Completed:
        return {
          label: 'Completed',
          variant: 'outline' as const,
        };
      case TaskStatus.Cancelled:
        return {
          label: 'Cancelled',
          variant: 'destructive' as const,
        };
      default:
        return {
          label: 'Unknown',
          variant: 'secondary' as const,
        };
    }
  };

  const config = getStatusConfig(status);

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
