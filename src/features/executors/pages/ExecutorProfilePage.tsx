import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Briefcase, GraduationCap, Languages } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card } from '@shared/components/ui/card';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { getById } from '../api/executorApi';
import { queryKeys } from '@shared/constants/queryKeys';
import { ROUTES } from '@shared/constants/routes';

/**
 * Executor profile page
 *
 * Displays full executor profile with:
 * - Personal information and image
 * - Service location and fields
 * - Work experience
 * - Education
 * - Languages
 * - Rating and completed tasks
 */
export function ExecutorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: executor, isLoading, isError } = useQuery({
    queryKey: queryKeys.executors.detail(id ?? ''),
    queryFn: () => getById(id ?? ''),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !executor) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <EmptyState
          title="Executor Not Found"
          description="The executor profile you are looking for does not exist"
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => navigate(ROUTES.EXECUTORS)}>Back to Executors</Button>
        </div>
      </div>
    );
  }

  const initials = `${executor.firstName[0]}${executor.lastName[0]}`.toUpperCase();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(ROUTES.EXECUTORS)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Executors
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              {executor.image ? (
                <img
                  src={executor.image}
                  alt={`${executor.firstName} ${executor.lastName}`}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary">
                  {initials}
                </div>
              )}

              <h1 className="mt-4 text-2xl font-bold">
                {executor.firstName} {executor.lastName}
              </h1>

              <div className="mt-2 flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {executor.serviceLocationName}, {executor.regionName}
                </span>
              </div>

              {executor.rating && (
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{executor.rating.toFixed(1)}</span>
                </div>
              )}

              <div className="mt-4 text-center">
                <p className="text-2xl font-bold">{executor.completedTasks}</p>
                <p className="text-sm text-gray-600">Tasks Completed</p>
              </div>

              {executor.isAvailable && (
                <div className="mt-4 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  Available for Work
                </div>
              )}
            </div>
          </Card>

          {/* Service Fields */}
          <Card className="mt-6 p-6">
            <h2 className="mb-3 text-lg font-semibold">Service Fields</h2>
            <div className="flex flex-wrap gap-2">
              {executor.serviceFields.map((field, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                >
                  {field}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Experience, Education, Languages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Experience */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </h2>
            <div className="space-y-4">
              {executor.workExperience.map((exp, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-sm text-gray-600">{exp.companyName}</p>
                  <p className="text-xs text-gray-500">
                    {exp.startDate} - {exp.endDate ?? 'Present'}
                  </p>
                  {exp.details && <p className="mt-2 text-sm">{exp.details}</p>}
                </div>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <GraduationCap className="h-5 w-5" />
              Education
            </h2>
            <div className="space-y-4">
              {executor.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h3 className="font-semibold">{edu.fieldOfStudy}</h3>
                  <p className="text-sm text-gray-600">{edu.schoolName}</p>
                  <p className="text-xs text-gray-500">
                    {edu.educationTypeName} • {edu.startDate} - {edu.endDate ?? 'Present'}
                  </p>
                  {edu.details && <p className="mt-2 text-sm">{edu.details}</p>}
                </div>
              ))}
            </div>
          </Card>

          {/* Languages */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
              <Languages className="h-5 w-5" />
              Languages
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {executor.languages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{lang.languageName}</span>
                  <span className="text-sm text-gray-600">
                    Level {lang.proficiencyLevel}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
