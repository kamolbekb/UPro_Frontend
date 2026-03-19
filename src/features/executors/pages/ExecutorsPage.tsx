import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Briefcase } from 'lucide-react';
import { Badge } from '@shared/components/ui/badge';
import { Input } from '@shared/components/ui/input';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { useExecutors } from '../hooks/useExecutors';
import { ROUTES } from '@shared/constants/routes';

/**
 * Executors list page
 */
export function ExecutorsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: executors, isLoading } = useExecutors();

  const filteredExecutors = executors?.filter((executor) => {
    const fullName = `${executor.firstName} ${executor.lastName}`.toLowerCase();
    const location = `${executor.serviceLocationName} ${executor.regionName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || location.includes(search);
  }) ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Executors</h1>
        <p className="mt-2 text-muted-foreground">
          Browse skilled professionals ready to help with your tasks
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 rounded-xl pl-10"
          />
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-muted-foreground">
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
            const initials = `${executor.firstName?.[0] ?? ''}${executor.lastName?.[0] ?? ''}`.toUpperCase();

            return (
              <div
                key={executor.id}
                className="group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                onClick={() => navigate(ROUTES.EXECUTOR_PROFILE(executor.id))}
              >
                {/* Gradient Header */}
                <div className="h-16 bg-gradient-primary" />

                <div className="px-5 pb-5">
                  {/* Profile Image */}
                  <div className="-mt-8 flex flex-col items-center">
                    {executor.image ? (
                      <img
                        src={executor.image}
                        alt={`${executor.firstName} ${executor.lastName}`}
                        className="h-16 w-16 rounded-full border-3 border-white object-cover shadow-soft"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-3 border-white bg-primary/10 text-xl font-semibold text-primary shadow-soft">
                        {initials}
                      </div>
                    )}

                    <h3 className="mt-3 text-lg font-semibold">
                      {executor.firstName} {executor.lastName}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{executor.serviceLocationName}, {executor.regionName}</span>
                    </div>

                    {executor.rating && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{executor.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{executor.completedTasks} tasks</span>
                    </div>
                    {executor.isAvailable && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                        Available
                      </Badge>
                    )}
                  </div>

                  {/* Service Fields Preview */}
                  {executor.serviceFields.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {executor.serviceFields.slice(0, 3).map((field: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {field}
                        </span>
                      ))}
                      {executor.serviceFields.length > 3 && (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          +{executor.serviceFields.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
