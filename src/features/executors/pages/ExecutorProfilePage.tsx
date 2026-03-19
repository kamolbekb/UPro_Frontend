import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Briefcase, GraduationCap, Languages } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Badge } from '@shared/components/ui/badge';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { getById } from '../api/executorApi';
import { queryKeys } from '@shared/constants/queryKeys';
import { ROUTES } from '@shared/constants/routes';

/**
 * Executor profile page
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !executor) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <EmptyState
          title="Executor Not Found"
          description="The executor profile you are looking for does not exist"
          action={{ label: 'Back to Executors', onClick: () => navigate(ROUTES.EXECUTORS) }}
        />
      </div>
    );
  }

  const initials = `${executor.firstName?.[0] ?? ''}${executor.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="animate-in">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Profile Info */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl border bg-card">
              {/* Gradient Header */}
              <div className="h-24 bg-gradient-primary" />
              <div className="px-6 pb-6">
                <div className="-mt-12 flex flex-col items-center">
                  {executor.image ? (
                    <img
                      src={executor.image}
                      alt={`${executor.firstName} ${executor.lastName}`}
                      className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-soft"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary/10 text-3xl font-semibold text-primary shadow-soft">
                      {initials}
                    </div>
                  )}

                  <h1 className="mt-3 text-xl font-bold">
                    {executor.firstName} {executor.lastName}
                  </h1>

                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{executor.serviceLocationName}, {executor.regionName}</span>
                  </div>

                  {executor.rating && (
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{executor.rating.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold text-primary">{executor.completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Tasks Completed</p>
                  </div>

                  {executor.isAvailable && (
                    <Badge className="mt-4 bg-emerald-50 text-emerald-700 border-emerald-200" variant="outline">
                      Available for Work
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Service Fields */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-3 text-base font-semibold">Service Fields</h2>
              <div className="flex flex-wrap gap-2">
                {executor.serviceFields.map((field, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Experience, Education, Languages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Experience */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                Work Experience
              </h2>
              <div className="space-y-4">
                {executor.workExperience.map((exp, index) => (
                  <div key={index} className="rounded-lg border-l-2 border-primary bg-muted/30 py-3 pl-4 pr-3">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                    <p className="text-xs text-muted-foreground">
                      {exp.startDate} - {exp.endDate ?? 'Present'}
                    </p>
                    {exp.details && <p className="mt-2 text-sm leading-relaxed">{exp.details}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                Education
              </h2>
              <div className="space-y-4">
                {executor.education.map((edu, index) => (
                  <div key={index} className="rounded-lg border-l-2 border-primary bg-muted/30 py-3 pl-4 pr-3">
                    <h3 className="font-semibold">{edu.fieldOfStudy}</h3>
                    <p className="text-sm text-muted-foreground">{edu.schoolName}</p>
                    <p className="text-xs text-muted-foreground">
                      {edu.educationTypeName} &middot; {edu.startDate} - {edu.endDate ?? 'Present'}
                    </p>
                    {edu.details && <p className="mt-2 text-sm leading-relaxed">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Languages className="h-4 w-4 text-primary" />
                </div>
                Languages
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {executor.languages.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                    <span className="font-medium">{lang.languageName}</span>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      Level {lang.proficiencyLevel}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
