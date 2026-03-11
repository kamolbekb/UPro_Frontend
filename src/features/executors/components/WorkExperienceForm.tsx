import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { Label } from '@shared/components/ui/label';
import { Checkbox } from '@shared/components/ui/checkbox';
import type { WorkExperience } from '../types/executor.types';

interface WorkExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
  errors?: Record<string, string>;
}

/**
 * Work experience form with dynamic array fields
 *
 * Features:
 * - Add/remove work experience entries
 * - "Currently working" checkbox (sets endDate to null)
 * - MM.YYYY date format validation
 *
 * Usage:
 * ```tsx
 * <WorkExperienceForm
 *   experiences={workExperience}
 *   onChange={setWorkExperience}
 * />
 * ```
 */
export function WorkExperienceForm({
  experiences,
  onChange,
  errors,
}: WorkExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...experiences,
      {
        companyName: '',
        position: '',
        startDate: '',
        endDate: '',
        details: '',
      },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | null) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value } as WorkExperience;
    onChange(updated);
  };

  const toggleCurrentlyWorking = (index: number, checked: boolean) => {
    const updated = [...experiences];
    updated[index] = {
      ...updated[index],
      endDate: checked ? null : '',
    } as WorkExperience;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button type="button" onClick={addExperience} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 && (
        <p className="text-sm text-gray-500">
          Add at least one work experience entry
        </p>
      )}

      {experiences.map((exp, index) => (
        <div key={index} className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Experience #{index + 1}</h4>
            {experiences.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor={`company-${index}`}>
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`company-${index}`}
              value={exp.companyName}
              onChange={(e) => updateExperience(index, 'companyName', e.target.value)}
              placeholder="e.g., Tech Solutions Inc."
            />
            {errors?.[`workExperience.${index}.companyName`] && (
              <p className="text-sm text-red-500">
                {errors[`workExperience.${index}.companyName`]}
              </p>
            )}
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor={`position-${index}`}>
              Position <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`position-${index}`}
              value={exp.position}
              onChange={(e) => updateExperience(index, 'position', e.target.value)}
              placeholder="e.g., Senior Developer"
            />
            {errors?.[`workExperience.${index}.position`] && (
              <p className="text-sm text-red-500">
                {errors[`workExperience.${index}.position`]}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`start-${index}`}>
                Start Date (MM.YYYY) <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`start-${index}`}
                value={exp.startDate}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                placeholder="01.2020"
                maxLength={7}
              />
              {errors?.[`workExperience.${index}.startDate`] && (
                <p className="text-sm text-red-500">
                  {errors[`workExperience.${index}.startDate`]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`end-${index}`}>End Date (MM.YYYY)</Label>
              <Input
                id={`end-${index}`}
                value={exp.endDate ?? ''}
                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                placeholder="12.2023"
                maxLength={7}
                disabled={exp.endDate === null}
              />
              {errors?.[`workExperience.${index}.endDate`] && (
                <p className="text-sm text-red-500">
                  {errors[`workExperience.${index}.endDate`]}
                </p>
              )}
            </div>
          </div>

          {/* Currently Working Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-${index}`}
              checked={exp.endDate === null}
              onCheckedChange={(checked) =>
                toggleCurrentlyWorking(index, checked === true)
              }
            />
            <Label
              htmlFor={`current-${index}`}
              className="cursor-pointer font-normal"
            >
              I currently work here
            </Label>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor={`details-${index}`}>Details (Optional)</Label>
            <Textarea
              id={`details-${index}`}
              value={exp.details ?? ''}
              onChange={(e) => updateExperience(index, 'details', e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
            />
          </div>
        </div>
      ))}

      {experiences.length === 0 && (
        <Button type="button" onClick={addExperience} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Work Experience
        </Button>
      )}
    </div>
  );
}
