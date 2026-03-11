import { useRegions } from '@shared/hooks/useRegions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select';
import { Label } from '@shared/components/ui/label';
import { LoadingSpinner } from '@shared/components/feedback/LoadingSpinner';

interface LocationSelectProps {
  regionId?: string | undefined;
  districtId?: string | undefined;
  onRegionChange: (regionId: string) => void;
  onDistrictChange: (districtId: string) => void;
  error?: string | undefined;
}

/**
 * Cascading location selector with region → district dropdowns
 *
 * Displays regions first, then shows districts for the selected region.
 * Both region and district selections are required.
 *
 * Usage:
 * ```tsx
 * <LocationSelect
 *   regionId={regionId}
 *   districtId={districtId}
 *   onRegionChange={setRegionId}
 *   onDistrictChange={setDistrictId}
 * />
 * ```
 */
export function LocationSelect({
  regionId,
  districtId,
  onRegionChange,
  onDistrictChange,
  error,
}: LocationSelectProps) {
  const { data: regions, isLoading } = useRegions();

  // Get selected region
  const selectedRegion = regions?.find((region) => region.id === regionId);

  // Get districts for selected region
  const districts = selectedRegion?.districts ?? [];

  /**
   * Handle region selection
   */
  const handleRegionChange = (value: string) => {
    onRegionChange(value);
    // Reset district when region changes
    onDistrictChange('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner />
        <span className="text-sm text-gray-500">Loading locations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Region Select */}
      <div className="space-y-2">
        <Label htmlFor="region">
          Region <span className="text-red-500">*</span>
        </Label>
        <Select value={regionId ?? ''} onValueChange={handleRegionChange}>
          <SelectTrigger id="region" className={error ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            {regions?.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* District Select (only show if region selected) */}
      {regionId && (
        <div className="space-y-2">
          <Label htmlFor="district">
            District <span className="text-red-500">*</span>
          </Label>
          <Select value={districtId ?? ''} onValueChange={onDistrictChange}>
            <SelectTrigger id="district" className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
