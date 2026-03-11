import { forwardRef } from 'react';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';

/**
 * PhoneInput component for E.164 formatted Uzbekistan phone numbers
 *
 * Features:
 * - Fixed +998 country code prefix
 * - Auto-formatting as user types
 * - Validation for 9-digit phone number
 * - Compatible with React Hook Form
 *
 * Format: +998 XX XXX XX XX
 * Example: +998 90 123 45 67
 *
 * @example
 * ```tsx
 * <PhoneInput
 *   {...register('phoneNumber')}
 *   error={errors.phoneNumber?.message}
 * />
 * ```
 */

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Error message to display */
  error?: string | undefined;
  /** Controlled value */
  value?: string | undefined;
  /** Change handler */
  onChange?: (value: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, error = undefined, value = '', onChange, ...props }, ref) => {
    /**
     * Format phone number with spaces for readability
     * Input: +99890123456 7 → Output: +998 90 123 45 67
     */
    const formatPhoneNumber = (input: string): string => {
      // Remove all non-digit characters except leading +
      const digits = input.replace(/[^\d+]/g, '');

      // Ensure it starts with +998
      let formatted = '+998';

      // Extract digits after country code
      const phoneDigits = digits.replace(/^\+998/, '');

      // Add spaces for readability: XX XXX XX XX
      if (phoneDigits.length > 0) {
        formatted += ' ' + phoneDigits.slice(0, 2);
      }
      if (phoneDigits.length > 2) {
        formatted += ' ' + phoneDigits.slice(2, 5);
      }
      if (phoneDigits.length > 5) {
        formatted += ' ' + phoneDigits.slice(5, 7);
      }
      if (phoneDigits.length > 7) {
        formatted += ' ' + phoneDigits.slice(7, 9);
      }

      return formatted;
    };

    /**
     * Handle input change and format value
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Format the input
      const formatted = formatPhoneNumber(inputValue);

      // Extract raw E.164 format for form submission (+998XXXXXXXXX)
      const rawValue = formatted.replace(/\s/g, '');

      // Call onChange with raw E.164 format
      onChange?.(rawValue);
    };

    /**
     * Display value with formatting
     */
    const displayValue = value ? formatPhoneNumber(value) : '+998 ';

    return (
      <div className="space-y-1">
        <Input
          ref={ref}
          type="tel"
          inputMode="numeric"
          placeholder="+998 90 123 45 67"
          value={displayValue}
          onChange={handleChange}
          maxLength={17} // +998 XX XXX XX XX (with spaces)
          className={cn(
            'font-mono',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'phone-error' : undefined}
          {...props}
        />
        {error && (
          <p id="phone-error" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
