import { useRef, useState, useEffect } from 'react';
import { cn } from '@/shared/utils/cn';

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const OTP_LENGTH = 6;

export function OtpInput({
  value = '',
  onChange,
  onComplete,
  error,
  disabled = false,
  className,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const digits = value.padEnd(OTP_LENGTH, '').slice(0, OTP_LENGTH).split('');
    setOtp(digits);
  }, [value]);

  const handleChange = (index: number, digit: string) => {
    const sanitized = digit.replace(/[^0-9]/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = sanitized;
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChange(otpString);

    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (sanitized && otpString.replace(/ /g, '').length === OTP_LENGTH && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');

    if (pastedData.length === OTP_LENGTH) {
      const digits = pastedData.split('');
      setOtp(digits);
      onChange(pastedData);
      inputRefs.current[OTP_LENGTH - 1]?.focus();

      if (onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-center gap-3">
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={otp[index] ?? ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={error ? 'true' : 'false'}
            className={cn(
              'h-14 w-12 rounded-xl border-2 bg-white text-center text-xl font-bold shadow-sm outline-none transition-all',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              otp[index]
                ? 'border-primary/40 bg-primary/5'
                : 'border-gray-300',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            )}
          />
        ))}
      </div>
      {error && (
        <p className="text-center text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
