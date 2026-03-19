import { Badge } from '@shared/components/ui/badge';
import { TaskStatus } from '../types/task.types';

export interface TaskStatusBadgeProps {
  status: TaskStatus;
}

/**
 * Task status badge with dot indicator and color coding
 */
export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const getStatusConfig = (taskStatus: TaskStatus) => {
    switch (taskStatus) {
      case TaskStatus.Draft:
        return { label: 'Draft', className: 'bg-gray-50 text-gray-600 border-gray-200' };
      case TaskStatus.Published:
        return { label: 'Open', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case TaskStatus.InProgress:
        return { label: 'In Progress', className: 'bg-blue-50 text-blue-700 border-blue-200' };
      case TaskStatus.Completed:
        return { label: 'Completed', className: 'bg-gray-50 text-gray-600 border-gray-200' };
      case TaskStatus.Cancelled:
        return { label: 'Cancelled', className: 'bg-red-50 text-red-600 border-red-200' };
      default:
        return { label: 'Unknown', className: '' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
