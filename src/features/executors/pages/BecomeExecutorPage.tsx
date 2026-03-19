import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { TaskImageUpload } from '@features/tasks/components/TaskImageUpload';
import { LocationSelect } from '@features/tasks/components/LocationSelect';
import { WorkExperienceForm } from '../components/WorkExperienceForm';
import { EducationForm } from '../components/EducationForm';
import { LanguageSelect } from '../components/LanguageSelect';
import { useBecomeExecutor } from '../hooks/useBecomeExecutor';
import { useCategories } from '@shared/hooks/useCategories';
import { useQuery } from '@tanstack/react-query';
import { getEducationTypes, getLanguages } from '../api/executorApi';
import { queryKeys } from '@shared/constants/queryKeys';
import { becomeExecutorSchema, type BecomeExecutorFormData } from '../schemas/executorSchemas';
import { ROUTES } from '@shared/constants/routes';
import type { WorkExperience, Education, LanguageProficiency } from '../types/executor.types';

const STEPS = [
  { id: 1, title: 'Personal Info', description: 'Basic information about you' },
  { id: 2, title: 'Service Details', description: 'Location and service fields' },
  { id: 3, title: 'Work Experience', description: 'Your professional background' },
  { id: 4, title: 'Education', description: 'Your educational background' },
  { id: 5, title: 'Languages', description: 'Languages you speak' },
];

/**
 * Become executor page with multi-step form
 */
export function BecomeExecutorPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [regionId, setRegionId] = useState('');
  const [image, setImage] = useState<File[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    { companyName: '', position: '', startDate: '', endDate: '', details: '' },
  ]);
  const [education, setEducation] = useState<Education[]>([
    { schoolName: '', educationTypeId: '', fieldOfStudy: '', startDate: '', endDate: '', details: '' },
  ]);
  const [languages, setLanguages] = useState<LanguageProficiency[]>([
    { languageId: '', proficiencyLevel: 1 },
  ]);
  const [serviceFields, setServiceFields] = useState<string[]>([]);

  const { data: categories } = useCategories();
  const { data: educationTypes, isLoading: loadingEduTypes } = useQuery({
    queryKey: queryKeys.executors.educationTypes(),
    queryFn: getEducationTypes,
  });
  const { data: availableLanguages, isLoading: loadingLanguages } = useQuery({
    queryKey: queryKeys.executors.languages(),
    queryFn: () => getLanguages(),
  });

  const becomeExecutorMutation = useBecomeExecutor();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<BecomeExecutorFormData>({
    resolver: zodResolver(becomeExecutorSchema),
    mode: 'onChange',
  });

  const formValues = watch();

  const nextStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger(['firstName', 'lastName', 'birthDate']);
        break;
      case 2:
        isValid = await trigger(['serviceLocationId', 'serviceFields']);
        break;
      case 3:
        isValid = workExperience.length > 0 && workExperience.every(
          (exp) => exp.companyName && exp.position && exp.startDate
        );
        break;
      case 4:
        isValid = education.length > 0 && education.every(
          (edu) => edu.schoolName && edu.educationTypeId && edu.fieldOfStudy && edu.startDate
        );
        break;
      case 5:
        isValid = languages.length > 0 && languages.every((lang) => lang.languageId);
        break;
    }

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BecomeExecutorFormData) => {
    await becomeExecutorMutation.mutateAsync({
      ...data,
      image: image[0],
      workExperience,
      education,
      languages,
      serviceFields,
    });
  };

  const toggleServiceField = (categoryId: string) => {
    setServiceFields((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="animate-in">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.TASKS)}
            className="-ml-2 mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold sm:text-3xl">Become an Executor</h1>
          <p className="mt-2 text-muted-foreground">
            Complete your profile to start offering your services
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all ${
                      currentStep > step.id
                        ? 'border-primary bg-primary text-white'
                        : currentStep === step.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted-foreground/30 text-muted-foreground/50'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <span className={`mt-2 hidden text-xs font-medium sm:block ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold">Personal Information</h2>
              <p className="mb-5 text-sm text-muted-foreground">Tell us a bit about yourself</p>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Profile Image (Optional)</Label>
                  <TaskImageUpload images={image} onChange={setImage} maxImages={1} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="firstName" {...register('firstName')} placeholder="John" className="h-11" />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="lastName" {...register('lastName')} placeholder="Doe" className="h-11" />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    Birth Date <span className="text-red-500">*</span>
                  </Label>
                  <Input id="birthDate" type="date" {...register('birthDate')} className="h-11" />
                  {errors.birthDate && (
                    <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Details */}
          {currentStep === 2 && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-1 text-lg font-semibold">Service Details</h2>
              <p className="mb-5 text-sm text-muted-foreground">Where and what services you offer</p>

              <div className="space-y-5">
                <LocationSelect
                  regionId={regionId}
                  districtId={formValues.serviceLocationId ?? ''}
                  onRegionChange={setRegionId}
                  onDistrictChange={(id) => register('serviceLocationId').onChange({ target: { value: id } })}
                  error={errors.serviceLocationId?.message}
                />

                <div className="space-y-2">
                  <Label>
                    Service Fields <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select the categories of services you offer (max 10)
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {categories?.filter((cat) => !cat.parentId).map((category) => (
                      <label
                        key={category.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${
                          serviceFields.includes(category.id)
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                            : 'border-muted hover:border-muted-foreground/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={serviceFields.includes(category.id)}
                          onChange={() => toggleServiceField(category.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                  {serviceFields.length === 0 && (
                    <p className="text-sm text-red-500">Select at least one service field</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Work Experience */}
          {currentStep === 3 && (
            <div className="rounded-xl border bg-card p-6">
              <WorkExperienceForm
                experiences={workExperience}
                onChange={setWorkExperience}
              />
            </div>
          )}

          {/* Step 4: Education */}
          {currentStep === 4 && (
            <div className="rounded-xl border bg-card p-6">
              <EducationForm
                education={education}
                educationTypes={educationTypes}
                isLoadingTypes={loadingEduTypes}
                onChange={setEducation}
              />
            </div>
          )}

          {/* Step 5: Languages */}
          {currentStep === 5 && (
            <div className="rounded-xl border bg-card p-6">
              <LanguageSelect
                languages={languages}
                availableLanguages={availableLanguages}
                isLoadingLanguages={loadingLanguages}
                onChange={setLanguages}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between rounded-xl border bg-card p-6">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={nextStep} className="bg-gradient-primary hover:opacity-90">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={becomeExecutorMutation.isPending}
                className="bg-gradient-primary hover:opacity-90"
              >
                {becomeExecutorMutation.isPending ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
