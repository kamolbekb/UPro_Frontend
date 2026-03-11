import { z } from 'zod';

/**
 * Authentication Zod validation schemas
 *
 * Provides client-side validation for auth forms using Zod
 */

/**
 * Email validation schema
 *
 * Format: standard email format
 * Example: user@example.com
 */
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

/**
 * OTP code validation schema (6 digits)
 *
 * Format: 6-digit numeric code
 * Example: 123456
 */
export const otpCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'OTP code must be exactly 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP code must contain only numbers'),
});

/**
 * Send OTP request validation schema
 */
export const sendOtpSchema = emailSchema;

/**
 * Verify OTP request validation schema
 *
 * Combines email and OTP code validation
 */
export const verifyOtpSchema = z.object({
  email: emailSchema.shape.email,
  code: otpCodeSchema.shape.code,
});

/**
 * Type inference helpers for form data
 */
export type SendOtpFormData = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type OtpCodeFormData = z.infer<typeof otpCodeSchema>;
