import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Briefcase } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/input';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { useExecutors } from '../hooks/useExecutors';
import { ROUTES } from '@shared/constants/routes';

/**
 * Executors list page
 *
 * Features:
 * - Search executors by name
 * - Filter by service location
 * - Grid view of executor cards
 * - Click to view full profile
 */
export function ExecutorsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: executors, isLoading } = useExecutors();

  // Filter executors by search term
  const filteredExecutors = executors?.filter((executor) => {
    const fullName = `${executor.firstName} ${executor.lastName}`.toLowerCase();
    const location = `${executor.serviceLocationName} ${executor.regionName}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || location.includes(search);
  }) ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Executors</h1>
        <p className="mt-2 text-gray-600">
          Browse skilled professionals ready to help with your tasks
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredExecutors.length} executor{filteredExecutors.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Executors Grid */}
      {filteredExecutors.length === 0 ? (
        <EmptyState
          title={searchTerm ? 'No Executors Found' : 'No Executors Available'}
          description={
            searchTerm
              ? 'Try adjusting your search terms'
              : 'There are no executors registered yet'
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExecutors.map((executor) => {
            const initials = `${executor.firstName[0]}${executor.lastName[0]}`.toUpperCase();

            return (
              <Card
                key={executor.id}
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => navigate(ROUTES.EXECUTOR_PROFILE(executor.id))}
              >
                <div className="p-6">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center">
                    {executor.image ? (
                      <img
                        src={executor.image}
                        alt={`${executor.firstName} ${executor.lastName}`}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                        {initials}
                      </div>
                    )}

                    <h3 className="mt-4 text-xl font-semibold">
                      {executor.firstName} {executor.lastName}
                    </h3>

                    {/* Location */}
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {executor.serviceLocationName}, {executor.regionName}
                      </span>
                    </div>

                    {/* Rating */}
                    {executor.rating && (
                      <div className="mt-2 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{executor.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{executor.completedTasks} tasks</span>
                    </div>
                    {executor.isAvailable && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Service Fields Preview */}
                  {executor.serviceFields.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {executor.serviceFields.slice(0, 3).map((field: string, index: number) => (
                          <span
                            key={index}
                            className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                          >
                            {field}
                          </span>
                        ))}
                        {executor.serviceFields.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            +{executor.serviceFields.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <Button className="mt-4 w-full" variant="outline">
                    View Profile
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
