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
 *
 * Allows users to register as executors by providing:
 * - Personal information and profile image
 * - Service location and fields
 * - Work experience history
 * - Education history
 * - Language proficiencies
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

    // Validate current step fields
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
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(ROUTES.TASKS)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Become an Executor</h1>
        <p className="mt-2 text-gray-600">
          Complete your profile to start offering your services
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    currentStep > step.id
                      ? 'border-primary bg-primary text-white'
                      : currentStep === step.id
                      ? 'border-primary text-primary'
                      : 'border-gray-300 text-gray-300'
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span className="mt-2 hidden text-xs font-medium sm:block">{step.title}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-1 flex-1 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
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
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>

            <div className="space-y-2">
              <Label>Profile Image (Optional)</Label>
              <TaskImageUpload images={image} onChange={setImage} maxImages={1} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input id="firstName" {...register('firstName')} placeholder="John" />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input id="lastName" {...register('lastName')} placeholder="Doe" />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">
                Birth Date <span className="text-red-500">*</span>
              </Label>
              <Input id="birthDate" type="date" {...register('birthDate')} />
              {errors.birthDate && (
                <p className="text-sm text-red-500">{errors.birthDate.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Service Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Service Details</h2>

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
              <p className="text-sm text-gray-500">
                Select the categories of services you offer (max 10)
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories?.filter((cat) => !cat.parentId).map((category) => (
                  <label
                    key={category.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                      serviceFields.includes(category.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
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
        )}

        {/* Step 3: Work Experience */}
        {currentStep === 3 && (
          <WorkExperienceForm
            experiences={workExperience}
            onChange={setWorkExperience}
          />
        )}

        {/* Step 4: Education */}
        {currentStep === 4 && (
          <EducationForm
            education={education}
            educationTypes={educationTypes}
            isLoadingTypes={loadingEduTypes}
            onChange={setEducation}
          />
        )}

        {/* Step 5: Languages */}
        {currentStep === 5 && (
          <LanguageSelect
            languages={languages}
            availableLanguages={availableLanguages}
            isLoadingLanguages={loadingLanguages}
            onChange={setLanguages}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={becomeExecutorMutation.isPending}>
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
  );
}
