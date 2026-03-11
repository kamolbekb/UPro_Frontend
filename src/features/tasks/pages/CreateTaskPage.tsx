import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { Label } from '@shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { TaskImageUpload } from '../components/TaskImageUpload';
import { CategorySelect } from '../components/CategorySelect';
import { LocationSelect } from '../components/LocationSelect';
import { useCreateTask } from '../hooks/useCreateTask';
import { useSaveDraft } from '../hooks/useSaveDraft';
import { useBudgetTypes } from '@shared/hooks/useBudgetTypes';
import { createTaskSchema, type CreateTaskFormData } from '../schemas/taskSchemas';
import { ROUTES } from '@shared/constants/routes';

/**
 * Task creation page
 *
 * Full-featured form for creating new tasks with:
 * - Title, description, category, budget, location fields
 * - Image upload with compression
 * - Auto-save draft functionality (every 30s)
 * - Form validation with Zod
 * - Loading and error states
 */
export function CreateTaskPage() {
  const navigate = useNavigate();
  const { data: budgetTypes, isLoading: loadingBudgetTypes } = useBudgetTypes();
  const createTaskMutation = useCreateTask();
  const saveDraftMutation = useSaveDraft();

  const [images, setImages] = useState<File[]>([]);
  const [regionId, setRegionId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      budgetTypeId: '',
      budgetAmount: 0,
      serviceLocationId: '',
      images: [],
    },
  });

  // Watch form fields for auto-save
  const formValues = watch();

  /**
   * Auto-save draft every 30 seconds
   */
  useEffect(() => {
    // Skip if form is empty
    if (!formValues.title && !formValues.description) {
      return undefined;
    }

    const interval = setInterval(() => {
      // Only save if we have at least a title
      if (formValues.title && formValues.title.length >= 5) {
        handleSaveDraft();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: CreateTaskFormData) => {
    // Validate images
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        ...data,
        images,
      });
    } catch (error) {
      // Error already handled by mutation
      console.error('Failed to create task:', error);
    }
  };

  /**
   * Save draft manually or via auto-save
   */
  const handleSaveDraft = async () => {
    const data = formValues;

    // Basic validation for draft
    if (!data.title || data.title.length < 5) {
      return;
    }

    if (!data.description || data.description.length < 20) {
      return;
    }

    try {
      await saveDraftMutation.mutateAsync({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId ?? '',
        subCategoryId: data.subCategoryId,
        budgetTypeId: data.budgetTypeId ?? '',
        budgetAmount: data.budgetAmount ?? 0,
        serviceLocationId: data.serviceLocationId ?? '',
        images,
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.TASKS)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
        <h1 className="text-3xl font-bold">Create New Task</h1>
        <p className="mt-2 text-gray-600">
          Post a task and get proposals from qualified executors
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Task Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="e.g., Build a responsive website for my business"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            {...register('description')}
            rows={6}
            placeholder="Describe your task in detail. Include requirements, expectations, and any specific instructions..."
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Category Select */}
        <CategorySelect
          categoryId={formValues.categoryId}
          subCategoryId={formValues.subCategoryId}
          onCategoryChange={(id) => setValue('categoryId', id)}
          onSubCategoryChange={(id) => setValue('subCategoryId', id)}
          error={errors.categoryId?.message}
        />

        {/* Budget */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Budget Type */}
          <div className="space-y-2">
            <Label htmlFor="budgetType">
              Budget Type <span className="text-red-500">*</span>
            </Label>
            {loadingBudgetTypes ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : (
              <Select
                value={formValues.budgetTypeId ?? ''}
                onValueChange={(value) => setValue('budgetTypeId', value)}
              >
                <SelectTrigger
                  id="budgetType"
                  className={errors.budgetTypeId ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {budgetTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.budgetTypeId && (
              <p className="text-sm text-red-500">{errors.budgetTypeId.message}</p>
            )}
          </div>

          {/* Budget Amount */}
          <div className="space-y-2">
            <Label htmlFor="budgetAmount">
              Budget Amount (UZS) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="budgetAmount"
              type="number"
              {...register('budgetAmount', { valueAsNumber: true })}
              placeholder="e.g., 5000000"
              className={errors.budgetAmount ? 'border-red-500' : ''}
            />
            {errors.budgetAmount && (
              <p className="text-sm text-red-500">{errors.budgetAmount.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <LocationSelect
          regionId={regionId}
          districtId={formValues.serviceLocationId ?? ''}
          onRegionChange={setRegionId}
          onDistrictChange={(id) => setValue('serviceLocationId', id)}
          error={errors.serviceLocationId?.message}
        />

        {/* Images */}
        <div className="space-y-2">
          <Label>
            Task Images <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-500">
            Upload photos that represent your task (minimum 1, maximum 5 images)
          </p>
          <TaskImageUpload images={images} onChange={setImages} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={saveDraftMutation.isPending}
          >
            {saveDraftMutation.isPending ? 'Saving...' : 'Save as Draft'}
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(ROUTES.TASKS)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Creating...</span>
                </>
              ) : (
                'Publish Task'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
