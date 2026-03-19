import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { TaskStatusBadge } from '../components/TaskStatusBadge';
import { useTaskDetail } from '../hooks/useTaskDetail';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { formatDate } from '@shared/utils/formatDate';
import { ROUTES } from '@shared/constants/routes';

/**
 * Task detail page
 */
export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: task, isLoading, isError, error } = useTaskDetail(id ?? '');

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <EmptyState
          title="Task Not Found"
          description={error?.message ?? 'The task you are looking for does not exist'}
          action={{ label: 'Back to Tasks', onClick: () => navigate(ROUTES.TASKS) }}
        />
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            {task.images.length > 0 && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={task.images[0]}
                  alt={task.title}
                  className="h-80 w-full object-cover sm:h-96"
                />
                {task.images.length > 1 && (
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {task.images.slice(1, 5).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${task.title} ${index + 2}`}
                        className="h-20 w-full rounded-lg object-cover sm:h-24"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Title and Status */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold sm:text-3xl">{task.title}</h1>
              <TaskStatusBadge status={task.status} />
            </div>

            {/* Description */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold">Description</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{task.description}</p>
            </div>

            {/* Task Details */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Task Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-semibold">
                      {formatCurrency(task.budgetAmount)}
                      {task.budgetTypeName === 'Hourly' && ' /hour'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">
                      {task.districtName}, {task.regionName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Posted</p>
                    <p className="font-semibold">{formatDate(task.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Applications</p>
                    <p className="font-semibold">{task.applicationCount} received</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Client Info and Actions */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Client</h2>
              <div className="flex items-start gap-3">
                {task.client.image ? (
                  <img
                    src={task.client.image}
                    alt={`${task.client.firstName} ${task.client.lastName}`}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {task.client.firstName[0]}
                    {task.client.lastName[0]}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold">
                    {task.client.firstName} {task.client.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.client.completedTasks} tasks completed
                  </p>
                  {task.client.rating && (
                    <p className="text-sm text-muted-foreground">
                      {task.client.rating.toFixed(1)} rating
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-2 text-lg font-semibold">Interested?</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Submit a proposal to work on this task
              </p>
              <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                Apply Now
              </Button>
            </div>

            {/* Category Information */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold">Category</h2>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-medium">{task.categoryName}</span>
              </div>
              {task.subCategoryName && (
                <p className="mt-1 pl-6 text-sm text-muted-foreground">{task.subCategoryName}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
