import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useLogin } from '../hooks/useLogin';
import { sendOtpSchema, type SendOtpFormData } from '../schemas/authSchemas';
import { ROUTES } from '@/shared/constants/routes';

/**
 * LoginPage - Email entry for OTP authentication
 * Rendered inside AuthLayout
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
    defaultValues: { email: '' },
  });

  const onSubmit = (data: SendOtpFormData) => {
    login.mutate(data.email, {
      onSuccess: () => {
        navigate(ROUTES.LOGIN_VERIFY, { state: { email: data.email } });
      },
    });
  };

  return (
    <div className="animate-in space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
          <Mail className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
            className={`h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full bg-gradient-primary text-base font-medium hover:opacity-90"
          disabled={login.isPending}
        >
          {login.isPending ? (
            'Sending OTP...'
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
