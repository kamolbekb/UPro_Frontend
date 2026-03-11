import { z } from 'zod';

/**
 * Authentication Zod validation schemas
 *
 * Provides client-side validation for auth forms using Zod
 */

/**
 * Phone number validation schema (E.164 format for Uzbekistan)
 *
 * Format: +998XXXXXXXXX (13 characters total)
 * Example: +998901234567
 */
export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+998[0-9]{9}$/,
      'Phone number must be in format +998XXXXXXXXX (e.g., +998901234567)'
    ),
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
export const sendOtpSchema = phoneNumberSchema;

/**
 * Verify OTP request validation schema
 *
 * Combines phone number and OTP code validation
 */
export const verifyOtpSchema = z.object({
  phoneNumber: phoneNumberSchema.shape.phoneNumber,
  code: otpCodeSchema.shape.code,
});

/**
 * Type inference helpers for form data
 */
export type SendOtpFormData = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type PhoneNumberFormData = z.infer<typeof phoneNumberSchema>;
export type OtpCodeFormData = z.infer<typeof otpCodeSchema>;
