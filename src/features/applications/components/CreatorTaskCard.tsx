import { Link } from 'react-router-dom';
import { MapPin, Calendar, Archive } from 'lucide-react';
import { Badge } from '@shared/components/ui/badge';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { formatDate } from '@shared/utils/formatDate';
import { ROUTES } from '@shared/constants/routes';
import type { CreatorTaskItem } from '../types/application.types';

interface CreatorTaskCardProps {
  task: CreatorTaskItem;
}

/**
 * Card component for tasks created by the current user
 */
export function CreatorTaskCard({ task }: CreatorTaskCardProps) {
  return (
    <Link to={ROUTES.TASK_DETAIL(task.id)} className="group block">
      <div className="overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card-hover">
        {task.image && (
          <div className="relative h-40 w-full overflow-hidden bg-muted">
            <img
              src={task.image}
              alt={task.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {task.isArchived && (
              <Badge variant="secondary" className="absolute right-2.5 top-2.5 bg-white/90 backdrop-blur-sm">
                <Archive className="mr-1 h-3 w-3" />
                Archived
              </Badge>
            )}
          </div>
        )}

        <div className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 font-semibold leading-snug">{task.title}</h3>
            {!task.image && task.isArchived && (
              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                <Archive className="mr-1 h-3 w-3" />
                Archived
              </Badge>
            )}
          </div>

          <p className="mb-3 text-xs text-muted-foreground">#{task.code}</p>

          {task.budget !== null && (
            <div className="mb-3 inline-flex items-baseline rounded-lg bg-primary/5 px-3 py-1">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(task.budget)}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t pt-3 text-xs text-muted-foreground">
            {(task.locationTypeName || task.districtName) && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{task.districtName || task.locationTypeName}</span>
              </div>
            )}
            {task.startDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(task.startDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
