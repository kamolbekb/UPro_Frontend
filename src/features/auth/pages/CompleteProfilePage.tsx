import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useCompleteProfile } from '../hooks/useCompleteProfile';

const completeProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

/**
 * CompleteProfilePage - Required after first login
 * Standalone layout (not inside MainLayout or AuthLayout)
 */
export function CompleteProfilePage() {
  const completeProfile = useCompleteProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  const onSubmit = (data: CompleteProfileFormData) => {
    completeProfile.mutate(data);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-auth px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="animate-in rounded-2xl border border-white/60 bg-white/70 p-8 shadow-hover backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
              <UserCircle className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Almost there!</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us your name to complete setup
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
                className={`h-11 ${errors.firstName ? 'border-red-500' : ''}`}
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
                className={`h-11 ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-gradient-primary text-base font-medium hover:opacity-90"
              disabled={completeProfile.isPending}
            >
              {completeProfile.isPending ? (
                'Saving...'
              ) : (
                <>
                  Complete Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
