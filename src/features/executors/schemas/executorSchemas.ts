import { z } from 'zod';
import { LanguageLevel } from '../types/executor.types';

/**
 * Work experience entry schema
 */
const workExperienceSchema = z.object({
  id: z.string().uuid().optional(),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must not exceed 100 characters'),
  position: z
    .string()
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position must not exceed 100 characters'),
  startDate: z
    .string()
    .regex(/^\d{2}\.\d{4}$/, 'Start date must be in MM.YYYY format'),
  endDate: z
    .string()
    .regex(/^\d{2}\.\d{4}$/, 'End date must be in MM.YYYY format')
    .nullable()
    .optional(),
  details: z.string().max(500, 'Details must not exceed 500 characters').nullable().optional(),
});

/**
 * Education entry schema
 */
const educationSchema = z.object({
  id: z.string().uuid().optional(),
  schoolName: z
    .string()
    .min(2, 'School name must be at least 2 characters')
    .max(100, 'School name must not exceed 100 characters'),
  educationTypeId: z.string().uuid('Invalid education type'),
  fieldOfStudy: z
    .string()
    .min(2, 'Field of study must be at least 2 characters')
    .max(100, 'Field of study must not exceed 100 characters'),
  startDate: z
    .string()
    .regex(/^\d{2}\.\d{4}$/, 'Start date must be in MM.YYYY format'),
  endDate: z
    .string()
    .regex(/^\d{2}\.\d{4}$/, 'End date must be in MM.YYYY format')
    .nullable()
    .optional(),
  details: z.string().max(500, 'Details must not exceed 500 characters').nullable().optional(),
});

/**
 * Language proficiency entry schema
 */
const languageProficiencySchema = z.object({
  id: z.string().uuid().optional(),
  languageId: z.string().uuid('Invalid language'),
  proficiencyLevel: z.nativeEnum(LanguageLevel),
});

/**
 * Become executor form schema
 */
export const becomeExecutorSchema = z.object({
  // Personal Info
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be smaller than 5MB')
    .optional(),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),

  // Service Info
  serviceLocationId: z.string().uuid('Invalid service location'),
  serviceFields: z
    .array(z.string().uuid())
    .min(1, 'Select at least one service field')
    .max(10, 'Maximum 10 service fields allowed'),

  // Dynamic Arrays
  workExperience: z
    .array(workExperienceSchema)
    .min(1, 'Add at least one work experience entry'),
  education: z
    .array(educationSchema)
    .min(1, 'Add at least one education entry'),
  languages: z
    .array(languageProficiencySchema)
    .min(1, 'Add at least one language'),
});

export type BecomeExecutorFormData = z.infer<typeof becomeExecutorSchema>;

/**
 * Update executor profile schema
 */
export const updateExecutorSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be smaller than 5MB')
    .optional(),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  serviceLocationId: z.string().uuid('Invalid service location').optional(),
  serviceFields: z
    .array(z.string().uuid())
    .min(1, 'Select at least one service field')
    .max(10, 'Maximum 10 service fields allowed')
    .optional(),
  workExperience: z.array(workExperienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  languages: z.array(languageProficiencySchema).optional(),
  isAvailable: z.boolean().optional(),
});

export type UpdateExecutorFormData = z.infer<typeof updateExecutorSchema>;

/**
 * Executor filters schema
 */
export const executorFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  regionId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
  minRating: z.number().min(0).max(5).optional(),
  isAvailable: z.boolean().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type ExecutorFiltersFormData = z.infer<typeof executorFiltersSchema>;
