import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { Label } from '@shared/components/ui/label';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import type { Education, EducationType } from '../types/executor.types';

interface EducationFormProps {
  education: Education[];
  educationTypes: EducationType[] | undefined;
  isLoadingTypes: boolean;
  onChange: (education: Education[]) => void;
  errors?: Record<string, string>;
}

/**
 * Education form with dynamic array fields
 *
 * Features:
 * - Add/remove education entries
 * - "Currently studying" checkbox (sets endDate to null)
 * - Education type selection
 * - MM.YYYY date format validation
 *
 * Usage:
 * ```tsx
 * <EducationForm
 *   education={education}
 *   educationTypes={educationTypes}
 *   isLoadingTypes={isLoading}
 *   onChange={setEducation}
 * />
 * ```
 */
export function EducationForm({
  education,
  educationTypes,
  isLoadingTypes,
  onChange,
  errors,
}: EducationFormProps) {
  const addEducation = () => {
    onChange([
      ...education,
      {
        schoolName: '',
        educationTypeId: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        details: '',
      },
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string | null) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value } as Education;
    onChange(updated);
  };

  const toggleCurrentlyStudying = (index: number, checked: boolean) => {
    const updated = [...education];
    updated[index] = {
      ...updated[index],
      endDate: checked ? null : '',
    } as Education;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button type="button" onClick={addEducation} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {education.length === 0 && (
        <p className="text-sm text-gray-500">Add at least one education entry</p>
      )}

      {education.map((edu, index) => (
        <div key={index} className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Education #{index + 1}</h4>
            {education.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>

          {/* School Name */}
          <div className="space-y-2">
            <Label htmlFor={`school-${index}`}>
              School/University <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`school-${index}`}
              value={edu.schoolName}
              onChange={(e) => updateEducation(index, 'schoolName', e.target.value)}
              placeholder="e.g., National University of Uzbekistan"
            />
            {errors?.[`education.${index}.schoolName`] && (
              <p className="text-sm text-red-500">
                {errors[`education.${index}.schoolName`]}
              </p>
            )}
          </div>

          {/* Education Type */}
          <div className="space-y-2">
            <Label htmlFor={`type-${index}`}>
              Education Type <span className="text-red-500">*</span>
            </Label>
            {isLoadingTypes ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : (
              <Select
                value={edu.educationTypeId}
                onValueChange={(value) => updateEducation(index, 'educationTypeId', value)}
              >
                <SelectTrigger id={`type-${index}`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {educationTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors?.[`education.${index}.educationTypeId`] && (
              <p className="text-sm text-red-500">
                {errors[`education.${index}.educationTypeId`]}
              </p>
            )}
          </div>

          {/* Field of Study */}
          <div className="space-y-2">
            <Label htmlFor={`field-${index}`}>
              Field of Study <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`field-${index}`}
              value={edu.fieldOfStudy}
              onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
              placeholder="e.g., Computer Science"
            />
            {errors?.[`education.${index}.fieldOfStudy`] && (
              <p className="text-sm text-red-500">
                {errors[`education.${index}.fieldOfStudy`]}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`edu-start-${index}`}>
                Start Date (MM.YYYY) <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`edu-start-${index}`}
                value={edu.startDate}
                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                placeholder="09.2018"
                maxLength={7}
              />
              {errors?.[`education.${index}.startDate`] && (
                <p className="text-sm text-red-500">
                  {errors[`education.${index}.startDate`]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edu-end-${index}`}>End Date (MM.YYYY)</Label>
              <Input
                id={`edu-end-${index}`}
                value={edu.endDate ?? ''}
                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                placeholder="06.2022"
                maxLength={7}
                disabled={edu.endDate === null}
              />
              {errors?.[`education.${index}.endDate`] && (
                <p className="text-sm text-red-500">
                  {errors[`education.${index}.endDate`]}
                </p>
              )}
            </div>
          </div>

          {/* Currently Studying Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-edu-${index}`}
              checked={edu.endDate === null}
              onCheckedChange={(checked) =>
                toggleCurrentlyStudying(index, checked === true)
              }
            />
            <Label
              htmlFor={`current-edu-${index}`}
              className="cursor-pointer font-normal"
            >
              I currently study here
            </Label>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor={`edu-details-${index}`}>Details (Optional)</Label>
            <Textarea
              id={`edu-details-${index}`}
              value={edu.details ?? ''}
              onChange={(e) => updateEducation(index, 'details', e.target.value)}
              placeholder="Additional information about your education..."
              rows={3}
            />
          </div>
        </div>
      ))}

      {education.length === 0 && (
        <Button type="button" onClick={addEducation} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Education Entry
        </Button>
      )}
    </div>
  );
}
