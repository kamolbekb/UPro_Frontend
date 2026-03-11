import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card } from '@shared/components/ui/card';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { TaskStatusBadge } from '../components/TaskStatusBadge';
import { useTaskDetail } from '../hooks/useTaskDetail';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { formatDate } from '@shared/utils/formatDate';
import { ROUTES } from '@shared/constants/routes';

/**
 * Task detail page
 *
 * Displays full task information including client details, images gallery,
 * description, and executor applications.
 */
export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: task, isLoading, isError, error } = useTaskDetail(id ?? '');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <EmptyState
          title="Task Not Found"
          description={error?.message ?? 'The task you are looking for does not exist'}
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate(ROUTES.TASKS)}>Back to Tasks</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(ROUTES.TASKS)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tasks
      </Button>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Task Details */}
        <div className="lg:col-span-2">
          {/* Images Gallery */}
          {task.images.length > 0 && (
            <div className="mb-6">
              <img
                src={task.images[0]}
                alt={task.title}
                className="h-96 w-full rounded-lg object-cover"
              />
              {task.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {task.images.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${task.title} ${index + 2}`}
                      className="h-24 w-full rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title and Status */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold">{task.title}</h1>
            <TaskStatusBadge status={task.status} />
          </div>

          {/* Description */}
          <Card className="mb-6 p-6">
            <h2 className="mb-3 text-xl font-semibold">Description</h2>
            <p className="whitespace-pre-wrap text-gray-700">{task.description}</p>
          </Card>

          {/* Task Details */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Task Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-semibold">
                    {formatCurrency(task.budgetAmount)}
                    {task.budgetTypeName === 'Hourly' && ' /hour'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">
                    {task.districtName}, {task.regionName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Posted</p>
                  <p className="font-semibold">{formatDate(task.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="font-semibold">{task.applicationCount} received</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Client Info and Actions */}
        <div className="lg:col-span-1">
          {/* Client Information */}
          <Card className="mb-6 p-6">
            <h2 className="mb-4 text-xl font-semibold">Client</h2>
            <div className="flex items-start gap-3">
              {task.client.image ? (
                <img
                  src={task.client.image}
                  alt={`${task.client.firstName} ${task.client.lastName}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold">
                  {task.client.firstName[0]}
                  {task.client.lastName[0]}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold">
                  {task.client.firstName} {task.client.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {task.client.completedTasks} tasks completed
                </p>
                {task.client.rating && (
                  <p className="text-sm text-gray-500">
                    ⭐ {task.client.rating.toFixed(1)} rating
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Apply Button */}
          <Card className="p-6">
            <h2 className="mb-3 text-lg font-semibold">Interested?</h2>
            <p className="mb-4 text-sm text-gray-600">
              Submit a proposal to work on this task
            </p>
            <Button className="w-full" size="lg">
              Apply Now
            </Button>
          </Card>

          {/* Category Information */}
          <Card className="mt-6 p-6">
            <h2 className="mb-3 text-lg font-semibold">Category</h2>
            <p className="font-medium">{task.categoryName}</p>
            {task.subCategoryName && (
              <p className="text-sm text-gray-500">{task.subCategoryName}</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
