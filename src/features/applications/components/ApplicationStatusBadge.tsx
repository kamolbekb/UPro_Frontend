import { Badge } from '@shared/components/ui/badge';

interface ApplicationStatusBadgeProps {
  statusName: string;
}

/**
 * Badge component for application status with color coding
 */
export function ApplicationStatusBadge({ statusName }: ApplicationStatusBadgeProps) {
  const getConfig = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'applied') {
      return { className: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
    if (normalized === 'viewed') {
      return { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
    if (normalized === 'accepted') {
      return { className: 'bg-green-100 text-green-800 border-green-200' };
    }
    if (normalized === 'completed') {
      return { className: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
    if (normalized === 'rejected') {
      return { className: 'bg-red-100 text-red-800 border-red-200' };
    }
    if (normalized === 'archived') {
      return { className: 'bg-gray-100 text-gray-500 border-gray-200' };
    }
    return { className: '' };
  };

  const config = getConfig(statusName);

  return (
    <Badge variant="outline" className={config.className}>
      {statusName}
    </Badge>
  );
}
