import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Label } from '@shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';
import type { Language, LanguageProficiency, LanguageLevel } from '../types/executor.types';

interface LanguageSelectProps {
  languages: LanguageProficiency[];
  availableLanguages: Language[] | undefined;
  isLoadingLanguages: boolean;
  onChange: (languages: LanguageProficiency[]) => void;
  errors?: Record<string, string>;
}

const proficiencyLevels: { level: LanguageLevel; label: string }[] = [
  { level: 1, label: '1 - Elementary' },
  { level: 2, label: '2 - Advanced' },
  { level: 3, label: '3 - Professional' },
  { level: 4, label: '4 - Proficient' },
  { level: 5, label: '5 - Native' },
];

/**
 * Language selection with proficiency levels
 *
 * Features:
 * - Add/remove language entries
 * - Language dropdown selection
 * - Proficiency level selector (1-5)
 *
 * Usage:
 * ```tsx
 * <LanguageSelect
 *   languages={languages}
 *   availableLanguages={languageList}
 *   isLoadingLanguages={isLoading}
 *   onChange={setLanguages}
 * />
 * ```
 */
export function LanguageSelect({
  languages,
  availableLanguages,
  isLoadingLanguages,
  onChange,
  errors,
}: LanguageSelectProps) {
  const addLanguage = () => {
    onChange([
      ...languages,
      {
        languageId: '',
        proficiencyLevel: 1,
      },
    ]);
  };

  const removeLanguage = (index: number) => {
    onChange(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (
    index: number,
    field: 'languageId' | 'proficiencyLevel',
    value: string | number
  ) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value } as LanguageProficiency;
    onChange(updated);
  };

  // Get available languages that haven't been selected yet
  const getAvailableLanguagesForIndex = (currentIndex: number) => {
    const selectedIds = languages
      .map((l, i) => (i !== currentIndex ? l.languageId : null))
      .filter(Boolean);
    return availableLanguages?.filter((lang) => !selectedIds.includes(lang.id)) ?? [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Languages</h3>
        <Button
          type="button"
          onClick={addLanguage}
          variant="outline"
          size="sm"
          disabled={isLoadingLanguages}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </div>

      {languages.length === 0 && (
        <p className="text-sm text-gray-500">Add at least one language</p>
      )}

      {isLoadingLanguages && (
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <span className="text-sm text-gray-500">Loading languages...</span>
        </div>
      )}

      {!isLoadingLanguages && languages.map((lang, index) => (
        <div key={index} className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Language #{index + 1}</h4>
            {languages.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor={`language-${index}`}>
                Language <span className="text-red-500">*</span>
              </Label>
              <Select
                value={lang.languageId}
                onValueChange={(value) => updateLanguage(index, 'languageId', value)}
              >
                <SelectTrigger id={`language-${index}`}>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableLanguagesForIndex(index).map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.[`languages.${index}.languageId`] && (
                <p className="text-sm text-red-500">
                  {errors[`languages.${index}.languageId`]}
                </p>
              )}
            </div>

            {/* Proficiency Level */}
            <div className="space-y-2">
              <Label htmlFor={`proficiency-${index}`}>
                Proficiency Level <span className="text-red-500">*</span>
              </Label>
              <Select
                value={lang.proficiencyLevel.toString()}
                onValueChange={(value) =>
                  updateLanguage(index, 'proficiencyLevel', parseInt(value))
                }
              >
                <SelectTrigger id={`proficiency-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map(({ level, label }) => (
                    <SelectItem key={level} value={level.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors?.[`languages.${index}.proficiencyLevel`] && (
                <p className="text-sm text-red-500">
                  {errors[`languages.${index}.proficiencyLevel`]}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {!isLoadingLanguages && languages.length === 0 && (
        <Button
          type="button"
          onClick={addLanguage}
          variant="outline"
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Language
        </Button>
      )}
    </div>
  );
}
