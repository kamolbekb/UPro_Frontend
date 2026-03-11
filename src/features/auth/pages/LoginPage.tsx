import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useLogin } from '../hooks/useLogin';
import { sendOtpSchema, type SendOtpFormData } from '../schemas/authSchemas';
import { ROUTES } from '@/shared/constants/routes';

/**
 * LoginPage - Email entry for OTP authentication
 *
 * Flow:
 * 1. User enters email address
 * 2. Form validates email format
 * 3. On submit, OTP is sent via email
 * 4. User is navigated to OTP verification page
 *
 * Features:
 * - Email validation (Zod + React Hook Form)
 * - Loading state during OTP send
 * - Auto-navigation on success
 * - Error handling with toast notifications
 */
export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendOtpFormData>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = (data: SendOtpFormData) => {
    login.mutate(data.email, {
      onSuccess: () => {
        // Navigate to OTP verification page with email
        navigate(ROUTES.LOGIN_VERIFY, {
          state: { email: data.email },
        });
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
        {/* Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to UPro</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={login.isPending}
              autoFocus
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={login.isPending}
          >
            {login.isPending ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
