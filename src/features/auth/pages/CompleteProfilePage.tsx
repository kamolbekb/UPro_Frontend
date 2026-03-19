import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useCompleteProfile } from '../hooks/useCompleteProfile';

/**
 * Profile completion schema
 */
const completeProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

/**
 * CompleteProfilePage - Required after first login
 *
 * Flow:
 * 1. User logs in for the first time
 * 2. isProfileCompleted is false
 * 3. User is redirected here to fill first/last name
 * 4. On submit, profile is completed and user can use the app
 */
export function CompleteProfilePage() {
  const completeProfile = useCompleteProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = (data: CompleteProfileFormData) => {
    completeProfile.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
        {/* Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <UserCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            Please provide your name to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <Input
              id="firstName"
              placeholder="John"
              {...register('firstName')}
              disabled={completeProfile.isPending}
              autoFocus
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register('lastName')}
              disabled={completeProfile.isPending}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={completeProfile.isPending}
          >
            {completeProfile.isPending ? 'Saving...' : 'Complete Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}
