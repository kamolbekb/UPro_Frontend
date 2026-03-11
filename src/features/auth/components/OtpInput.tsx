import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';

/**
 * OtpInput component for 6-digit OTP codes
 *
 * Features:
 * - 6 separate input boxes
 * - Auto-focus next input on digit entry
 * - Auto-focus previous input on backspace
 * - Paste support (paste full code into any input)
 * - Auto-submit when all 6 digits entered
 * - Numeric keyboard on mobile
 *
 * @example
 * ```tsx
 * <OtpInput
 *   value={otp}
 *   onChange={setOtp}
 *   onComplete={(code) => verifyOtp(code)}
 *   error={errors.code?.message}
 * />
 * ```
 */

export interface OtpInputProps {
  /** Current OTP value (6 digits) */
  value: string;
  /** Change handler - receives updated OTP string */
  onChange: (value: string) => void;
  /** Called when all 6 digits are entered */
  onComplete?: (code: string) => void;
  /** Error message to display */
  error?: string;
  /** Disable all inputs */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function OtpInput({
  value = '',
  onChange,
  onComplete,
  error,
  disabled = false,
  className,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * Sync internal state with external value prop
   */
  useEffect(() => {
    const digits = value.padEnd(6, '').slice(0, 6).split('');
    setOtp(digits);
  }, [value]);

  /**
   * Handle input change for a specific box
   */
  const handleChange = (index: number, digit: string) => {
    // Only allow single digits
    const sanitized = digit.replace(/[^0-9]/g, '').slice(-1);

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);

    // Notify parent
    const otpString = newOtp.join('');
    onChange(otpString);

    // Auto-focus next input if digit entered
    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all 6 digits entered
    if (sanitized && otpString.length === 6 && onComplete) {
      onComplete(otpString);
    }
  };

  /**
   * Handle backspace to focus previous input
   */
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // If current box is empty and backspace pressed, focus previous
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle paste event to auto-fill all boxes
   */
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');

    if (pastedData.length === 6) {
      const digits = pastedData.split('');
      setOtp(digits);
      onChange(pastedData);

      // Focus last input
      inputRefs.current[5]?.focus();

      // Call onComplete
      if (onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el: HTMLInputElement | null) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              'w-12 h-12 text-center text-lg font-semibold',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={error ? 'true' : 'false'}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
