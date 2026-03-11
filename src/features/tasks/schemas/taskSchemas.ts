import { z } from 'zod';
import { TaskStatus } from '../types/task.types';

/**
 * Zod schema for task filters validation
 */
export const taskFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  subCategoryId: z.string().uuid().optional(),
  regionId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
  budgetTypeId: z.string().uuid().optional(),
  minBudget: z.number().nonnegative().optional(),
  maxBudget: z.number().nonnegative().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type TaskFiltersFormData = z.infer<typeof taskFiltersSchema>;

/**
 * Zod schema for task creation form
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  categoryId: z.string().uuid('Invalid category selection'),
  subCategoryId: z.string().uuid().optional(),
  budgetTypeId: z.string().uuid('Invalid budget type selection'),
  budgetAmount: z
    .number()
    .positive('Budget amount must be greater than 0'),
  serviceLocationId: z.string().uuid('Invalid location selection'),
  images: z
    .array(
      z.instanceof(File).refine(
        (file) => file.size <= 5 * 1024 * 1024, // 5MB max
        'Each image must be smaller than 5MB'
      )
    )
    .max(5, 'Maximum 5 images allowed')
    .optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

/**
 * Zod schema for task update form
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters')
    .optional(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  categoryId: z.string().uuid().optional(),
  subCategoryId: z.string().uuid().optional(),
  budgetTypeId: z.string().uuid().optional(),
  budgetAmount: z.number().positive().optional(),
  serviceLocationId: z.string().uuid().optional(),
  images: z
    .array(
      z.instanceof(File).refine(
        (file) => file.size <= 5 * 1024 * 1024,
        'Each image must be smaller than 5MB'
      )
    )
    .max(5, 'Maximum 5 images allowed')
    .optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
