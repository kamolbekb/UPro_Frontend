import { Link } from 'react-router-dom';
import { MapPin, Bookmark, Users } from 'lucide-react';
import { Card } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { TaskStatusBadge } from './TaskStatusBadge';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { formatRelativeTime } from '@shared/utils/formatDate';
import { ROUTES } from '@shared/constants/routes';
import type { Task } from '../types/task.types';

export interface TaskCardProps {
  task: Task;
  onBookmarkToggle?: (taskId: string, isBookmarked: boolean) => void;
}

/**
 * Task card component for list view
 *
 * Displays task summary with image, title, budget, location, and status.
 * Includes bookmark button and click to navigate to detail page.
 */
export function TaskCard({ task, onBookmarkToggle }: TaskCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking bookmark
    e.stopPropagation();
    onBookmarkToggle?.(task.id, task.isBookmarked);
  };

  return (
    <Link to={ROUTES.TASK_DETAIL(task.id)}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        {/* Image */}
        {task.images && task.images.length > 0 && (
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <img
              src={task.images[0]}
              alt={task.title}
              className="h-full w-full object-cover"
            />
            {/* Bookmark button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-white/80 hover:bg-white"
              onClick={handleBookmarkClick}
            >
              <Bookmark
                className={
                  task.isBookmarked ? 'fill-primary text-primary' : 'text-gray-600'
                }
              />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Title and Status */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 text-lg font-semibold">{task.title}</h3>
            <TaskStatusBadge status={task.status} />
          </div>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">{task.description}</p>

          {/* Category */}
          <div className="mb-2 text-sm text-gray-500">
            {task.categoryName}
            {task.subCategoryName && ` › ${task.subCategoryName}`}
          </div>

          {/* Budget */}
          <div className="mb-3 text-xl font-bold text-primary">
            {formatCurrency(task.budgetAmount)}
            <span className="ml-1 text-sm font-normal text-gray-500">
              {task.budgetTypeName === 'Hourly' && '/hour'}
            </span>
          </div>

          {/* Footer: Location and Applications */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>
                {task.districtName}, {task.regionName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{task.applicationCount} applications</span>
            </div>
          </div>

          {/* Created date */}
          <div className="mt-2 text-xs text-gray-400">
            Posted {formatRelativeTime(task.createdAt)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
