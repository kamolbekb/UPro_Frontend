import { X } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { useCategories } from '@shared/hooks/useCategories';
import { useRegions } from '@shared/hooks/useRegions';
import { TaskStatus } from '../types/task.types';

export interface TaskFiltersProps {
  searchTerm: string;
  categoryId?: string | undefined;
  regionId?: string | undefined;
  districtId?: string | undefined;
  status?: TaskStatus | undefined;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string | undefined) => void;
  onRegionChange: (regionId: string | undefined) => void;
  onDistrictChange: (districtId: string | undefined) => void;
  onStatusChange: (status: TaskStatus | undefined) => void;
  onReset: () => void;
}

/**
 * Task filters component
 *
 * Provides search input and filter dropdowns for browsing tasks.
 * Includes category, location, and status filters.
 */
export function TaskFilters({
  searchTerm,
  categoryId,
  regionId,
  districtId,
  status,
  onSearchChange,
  onCategoryChange,
  onRegionChange,
  onDistrictChange,
  onStatusChange,
  onReset,
}: TaskFiltersProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: regions, isLoading: regionsLoading } = useRegions();

  // Get selected region's districts
  const selectedRegion = regions?.find((r) => r.id === regionId);
  const districts = selectedRegion?.districts ?? [];

  // Check if any filters are active
  const hasActiveFilters = !!(
    searchTerm ||
    categoryId ||
    regionId ||
    districtId ||
    status !== undefined
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category Filter */}
        <Select
          value={categoryId ?? ''}
          onValueChange={(value) => onCategoryChange(value || undefined)}
          disabled={categoriesLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories
              ?.filter((cat) => !cat.parentId) // Only top-level categories
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Region Filter */}
        <Select
          value={regionId ?? ''}
          onValueChange={(value) => {
            onRegionChange(value || undefined);
            onDistrictChange(undefined); // Reset district when region changes
          }}
          disabled={regionsLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            {regions?.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* District Filter (only enabled when region is selected) */}
        <Select
          value={districtId ?? ''}
          onValueChange={(value) => onDistrictChange(value || undefined)}
          disabled={!regionId || districts.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.id} value={district.id}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={status?.toString() ?? ''}
          onValueChange={(value) =>
            onStatusChange(value ? Number(value) as TaskStatus : undefined)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TaskStatus.Published.toString()}>Open</SelectItem>
            <SelectItem value={TaskStatus.InProgress.toString()}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.Completed.toString()}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="mr-1 h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
