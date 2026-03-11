import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { OtpInput } from '../components/OtpInput';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '@/shared/constants/routes';

/**
 * Location state from LoginPage
 */
interface LocationState {
  phoneNumber: string;
}

/**
 * OtpVerifyPage - OTP code verification
 *
 * Flow:
 * 1. User arrives from LoginPage with phone number in state
 * 2. User enters 6-digit OTP code
 * 3. On complete, OTP is auto-submitted
 * 4. On success, user is authenticated and navigated to tasks
 *
 * Features:
 * - 6-digit OTP input with auto-focus
 * - Auto-submit on complete
 * - Resend OTP with 60-second countdown
 * - Back button to return to phone entry
 * - Loading state during verification
 */
export function OtpVerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const verifyOtp = useVerifyOtp();
  const login = useLogin();

  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Get phone number from navigation state
  const phoneNumber = (location.state as LocationState | null)?.phoneNumber;

  /**
   * Redirect to login if no phone number in state
   */
  useEffect(() => {
    if (!phoneNumber) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [phoneNumber, navigate]);

  /**
   * Countdown timer for resend button
   */
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    setCanResend(true);
    return undefined;
  }, [resendCountdown]);

  /**
   * Handle OTP completion (auto-submit)
   */
  const handleComplete = (code: string) => {
    if (phoneNumber) {
      verifyOtp.mutate({ phoneNumber, code });
    }
  };

  /**
   * Handle resend OTP
   */
  const handleResend = () => {
    if (!canResend || !phoneNumber) return;

    login.mutate(phoneNumber, {
      onSuccess: () => {
        // Reset countdown
        setResendCountdown(60);
        setCanResend(false);
        // Clear OTP input
        setOtp('');
      },
    });
  };

  /**
   * Handle back button
   */
  const handleBack = () => {
    navigate(ROUTES.LOGIN);
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('998')) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
    }
    return phone;
  };

  if (!phoneNumber) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          disabled={verifyOtp.isPending}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to
          </p>
          <p className="font-mono text-sm font-medium">
            {formatPhoneNumber(phoneNumber)}
          </p>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <OtpInput
            value={otp}
            onChange={setOtp}
            onComplete={handleComplete}
            disabled={verifyOtp.isPending}
          />

          {verifyOtp.isPending && (
            <p className="text-center text-sm text-muted-foreground">
              Verifying...
            </p>
          )}
        </div>

        {/* Resend Button */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-muted-foreground">Didn't receive the code?</span>
          <Button
            variant="link"
            size="sm"
            onClick={handleResend}
            disabled={!canResend || login.isPending}
            className="h-auto p-0"
          >
            {canResend
              ? login.isPending
                ? 'Sending...'
                : 'Resend OTP'
              : `Resend in ${resendCountdown}s`}
          </Button>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground">
          The code will expire in 5 minutes
        </p>
      </div>
    </div>
  );
}
