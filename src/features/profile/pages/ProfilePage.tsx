import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Camera, Trash2, Edit, Shield, Mail, Briefcase } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Badge } from '@shared/components/ui/badge';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { useCurrentUser, useUpdateProfile, useDeleteProfile } from '../hooks/useProfile';
import { updateProfileSchema, type UpdateProfileFormData } from '../schemas/profileSchemas';
import type { UpdateMyProfileRequest } from '@features/auth/types/auth.types';
import { ROUTES } from '@shared/constants/routes';

/**
 * Profile page — view and edit user profile
 */
export function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <EmptyState
          title="Failed to load profile"
          description="Something went wrong. Please try again later."
          action={{
            label: 'Go Home',
            onClick: () => navigate(ROUTES.HOME),
          }}
        />
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setImagePreview(null);
    setSelectedImage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
    setSelectedImage(null);
    reset({ firstName: profile.firstName, lastName: profile.lastName });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: UpdateProfileFormData) => {
    const payload: UpdateMyProfileRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
    };
    if (selectedImage) {
      payload.image = selectedImage;
    }
    updateProfile.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
        setImagePreview(null);
        setSelectedImage(null);
      },
    });
  };

  const handleDelete = () => {
    deleteProfile.mutate();
  };

  const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase();
  const displayImage = imagePreview ?? profile.image;

  return (
    <div className="animate-in">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">My Profile</h1>

        {/* Profile Card */}
        <div className="mb-6 overflow-hidden rounded-xl border bg-card">
          {/* Gradient Header */}
          <div className="h-20 bg-gradient-primary" />
          <div className="px-6 pb-6">
            <div className="-mt-10 flex flex-col items-center sm:flex-row sm:items-end sm:gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary/10 shadow-soft">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {initials || <User className="h-8 w-8" />}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>

              {/* Info */}
              <div className="mt-3 flex-1 text-center sm:mt-0 sm:text-left">
                <h2 className="text-xl font-semibold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                  <Mail className="h-3.5 w-3.5" />
                  {profile.email}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge variant="secondary">
                <Shield className="mr-1 h-3 w-3" />
                {profile.role === 1 ? 'Admin' : 'User'}
              </Badge>
              {profile.isExecutor && (
                <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                  Executor
                </Badge>
              )}
              {profile.isActive ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Active
                </Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
              <span className="text-xs text-muted-foreground">#{profile.code}</span>
            </div>
          </div>
        </div>

        {/* Become Executor CTA */}
        {!profile.isExecutor && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Become an Executor</p>
                  <p className="text-sm text-muted-foreground">
                    Start earning by completing tasks from clients
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate(ROUTES.EXECUTOR_BECOME)}
                className="bg-gradient-primary hover:opacity-90"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}

        {/* Profile Details / Edit Form */}
        <div className="mb-6 rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <h3 className="text-lg font-semibold">Profile Details</h3>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
          <div className="p-5">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      className={`mt-1 h-11 ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      className={`mt-1 h-11 ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={profile.email} disabled className="mt-1 h-11 bg-muted" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {updateProfile.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateProfile.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">First Name</p>
                    <p className="mt-0.5 text-base">{profile.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                    <p className="mt-0.5 text-base">{profile.lastName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="mt-0.5 text-base">{profile.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-200 bg-card">
          <div className="border-b border-red-200 p-5">
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
          </div>
          <div className="p-5">
            {showDeleteConfirm ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="mb-4 text-sm text-red-800">
                  Are you sure you want to delete your account? This action cannot be undone.
                  All your tasks, applications, and data will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteProfile.isPending}
                  >
                    {deleteProfile.isPending && <LoadingSpinner size="sm" className="mr-2" />}
                    Yes, Delete My Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteProfile.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
