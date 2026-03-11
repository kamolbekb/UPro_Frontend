import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { PhoneInput } from '../components/PhoneInput';
import { useLogin } from '../hooks/useLogin';
import { sendOtpSchema, type SendOtpFormData } from '../schemas/authSchemas';
import { ROUTES } from '@/shared/constants/routes';

/**
 * LoginPage - Phone number entry for OTP authentication
 *
 * Flow:
 * 1. User enters phone number in E.164 format (+998XXXXXXXXX)
 * 2. Form validates phone number format
 * 3. On submit, OTP is sent via SMS
 * 4. User is navigated to OTP verification page
 *
 * Features:
 * - Phone number validation (Zod + React Hook Form)
 * - Loading state during OTP send
 * - Auto-navigation on success
 * - Error handling with toast notifications
 */
export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SendOtpFormData>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = (data: SendOtpFormData) => {
    login.mutate(data.phoneNumber, {
      onSuccess: () => {
        // Navigate to OTP verification page with phone number
        navigate(ROUTES.LOGIN_VERIFY, {
          state: { phoneNumber: data.phoneNumber },
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
            <Smartphone className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to UPro</h1>
          <p className="text-sm text-muted-foreground">
            Enter your phone number to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  id="phoneNumber"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.phoneNumber?.message}
                  disabled={login.isPending}
                  autoFocus
                />
              )}
            />
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
