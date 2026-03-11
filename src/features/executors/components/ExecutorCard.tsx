import { Link } from 'react-router-dom';
import { MapPin, Star, CheckCircle } from 'lucide-react';
import { Card } from '@shared/components/ui/card';
import { Button } from '@shared/components/ui/button';
import { ROUTES } from '@shared/constants/routes';
import type { ExecutorListItem } from '../types/executor.types';

interface ExecutorCardProps {
  executor: ExecutorListItem;
}

/**
 * Executor card component for browse executors page
 *
 * Displays executor profile summary with:
 * - Profile image or initials
 * - Name, location, rating
 * - Completed tasks count
 * - Availability status
 * - Service fields (categories)
 *
 * Usage:
 * ```tsx
 * <ExecutorCard executor={executor} />
 * ```
 */
export function ExecutorCard({ executor }: ExecutorCardProps) {
  const initials = `${executor.firstName[0]}${executor.lastName[0]}`.toUpperCase();

  return (
    <Link to={ROUTES.EXECUTOR_PROFILE(executor.id)}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="p-6">
          {/* Header with Image/Initials */}
          <div className="flex items-start gap-4">
            {/* Profile Image */}
            {executor.image ? (
              <img
                src={executor.image}
                alt={`${executor.firstName} ${executor.lastName}`}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                {initials}
              </div>
            )}

            {/* Name and Location */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">
                {executor.firstName} {executor.lastName}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {executor.serviceLocationName}, {executor.regionName}
                </span>
              </div>
            </div>

            {/* Availability Badge */}
            {executor.isAvailable && (
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="h-3 w-3" />
                Available
              </div>
            )}
          </div>

          {/* Rating and Tasks */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            {/* Rating */}
            {executor.rating !== null && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{executor.rating.toFixed(1)}</span>
              </div>
            )}

            {/* Completed Tasks */}
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>
                {executor.completedTasks} task{executor.completedTasks !== 1 ? 's' : ''}{' '}
                completed
              </span>
            </div>
          </div>

          {/* Service Fields */}
          {executor.serviceFields.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {executor.serviceFields.slice(0, 3).map((field, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {field}
                </span>
              ))}
              {executor.serviceFields.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  +{executor.serviceFields.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* View Profile Button */}
          <div className="mt-4">
            <Button variant="outline" className="w-full" size="sm">
              View Profile
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
