import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { OtpInput } from '../components/OtpInput';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '@/shared/constants/routes';

interface LocationState {
  email: string;
}

/**
 * OtpVerifyPage - OTP code verification
 * Rendered inside AuthLayout
 */
export function OtpVerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const verifyOtp = useVerifyOtp();
  const login = useLogin();

  const [otp, setOtp] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = (location.state as LocationState | null)?.email;

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [email, navigate]);

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

  const handleComplete = (code: string) => {
    if (email) {
      verifyOtp.mutate({ email, code });
    }
  };

  const handleResend = () => {
    if (!canResend || !email) return;
    login.mutate(email, {
      onSuccess: () => {
        setResendCountdown(60);
        setCanResend(false);
        setOtp('');
      },
    });
  };

  if (!email) return null;

  return (
    <div className="animate-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(ROUTES.LOGIN)}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        disabled={verifyOtp.isPending}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code sent to
        </p>
        <p className="mx-auto mt-2 inline-block rounded-lg bg-primary/5 px-3 py-1.5 font-mono text-sm font-medium text-primary">
          {email}
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
          <p className="animate-pulse text-center text-sm text-muted-foreground">
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
          className="h-auto p-0 font-semibold"
        >
          {canResend
            ? login.isPending
              ? 'Sending...'
              : 'Resend OTP'
            : `Resend in ${resendCountdown}s`}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        The code will expire in 5 minutes
      </p>
    </div>
  );
}
