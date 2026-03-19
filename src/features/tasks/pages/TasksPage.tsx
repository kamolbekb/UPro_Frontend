import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { TaskFilters } from '../components/TaskFilters';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { Skeleton } from '@shared/components/ui/skeleton';
import { Button } from '@shared/components/ui/button';
import { useTasks } from '../hooks/useTasks';
import { useTaskSearch } from '../hooks/useTaskSearch';
import { ROUTES } from '@shared/constants/routes';

/**
 * Tasks browsing page
 *
 * Displays paginated task list with search and filters.
 * Implements infinite scroll to load more tasks as user scrolls.
 */
export function TasksPage() {
  const navigate = useNavigate();
  const {
    filters,
    debouncedFilters,
    setSearchTerm,
    setCategory,
    setRegion,
    setStatus,
    resetFilters,
  } = useTaskSearch();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useTasks(debouncedFilters);

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allTasks = data?.pages.flatMap((page) => page.items ?? []).filter(Boolean) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const handleDistrictChange = (_districtId: string | undefined) => {
    // District change is handled by region change in TaskFilters
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Find freelance opportunities that match your skills
          </p>
        </div>
        <Button
          onClick={() => navigate(ROUTES.TASK_NEW)}
          size="lg"
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TaskFilters
          searchTerm={filters.searchTerm ?? ''}
          categoryId={filters.categoryId}
          regionId={filters.regionId}
          districtId={filters.districtId}
          status={filters.status}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategory}
          onRegionChange={(regionId) => setRegion(regionId, undefined)}
          onDistrictChange={handleDistrictChange}
          onStatusChange={setStatus}
          onReset={resetFilters}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border">
              <Skeleton className="h-48 w-full" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <EmptyState
          title="Failed to Load Tasks"
          description={error?.message ?? 'An error occurred while loading tasks'}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && allTasks.length === 0 && (
        <EmptyState
          title="No Tasks Found"
          description="Try adjusting your search or filters to find more tasks"
        />
      )}

      {/* Task Grid */}
      {!isLoading && !isError && allTasks.length > 0 && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {allTasks.length} of {totalCount} tasks
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onBookmarkToggle={(taskId, isBookmarked) => {
                  // TODO: Implement bookmark toggle mutation
                  console.log('Bookmark toggle', taskId, isBookmarked);
                }}
              />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="mt-8 flex justify-center">
            {isFetchingNextPage && <LoadingSpinner />}
            {!hasNextPage && allTasks.length > 0 && (
              <p className="text-sm text-muted-foreground">No more tasks to load</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
