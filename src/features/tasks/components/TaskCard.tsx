import { Link } from 'react-router-dom';
import { MapPin, Bookmark, Users } from 'lucide-react';
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
 * Task card component for list view — polished with hover effects and shadows
 */
export function TaskCard({ task, onBookmarkToggle }: TaskCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkToggle?.(task.id, task.isBookmarked);
  };

  return (
    <Link to={ROUTES.TASK_DETAIL(task.id)} className="group block">
      <div className="overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card-hover">
        {/* Image */}
        {task.images && task.images.length > 0 && (
          <div className="relative h-44 w-full overflow-hidden bg-muted">
            <img
              src={task.images[0]}
              alt={task.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {/* Bookmark */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2.5 top-2.5 h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
              onClick={handleBookmarkClick}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  task.isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'
                }`}
              />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Title + Status */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 font-semibold leading-snug">
              {task.title}
            </h3>
            <TaskStatusBadge status={task.status} />
          </div>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>

          {/* Category */}
          {task.categoryName && (
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              {task.categoryName}
              {task.subCategoryName && ` › ${task.subCategoryName}`}
            </p>
          )}

          {/* Budget */}
          <div className="mb-3 inline-flex items-baseline rounded-lg bg-primary/5 px-3 py-1">
            <span className="text-lg font-bold text-primary">
              {formatCurrency(task.budgetAmount)}
            </span>
            {task.budgetTypeName === 'Hourly' && (
              <span className="ml-1 text-xs text-muted-foreground">/hour</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{task.districtName}, {task.regionName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{task.applicationCount}</span>
            </div>
          </div>

          {/* Time */}
          <p className="mt-2 text-xs text-muted-foreground/60">
            Posted {formatRelativeTime(task.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
