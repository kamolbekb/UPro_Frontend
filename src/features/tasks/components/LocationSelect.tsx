import { useRegions } from '@shared/hooks/useRegions';
import { useQuery } from '@tanstack/react-query';
import { getDistricts } from '@shared/api/locationApi';
import { queryKeys } from '@shared/constants/queryKeys';
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
 * Fetches regions on mount, then fetches districts separately
 * when a region is selected.
 */
export function LocationSelect({
  regionId,
  districtId,
  onRegionChange,
  onDistrictChange,
  error,
}: LocationSelectProps) {
  const { data: regions, isLoading } = useRegions();

  // Fetch districts when a region is selected
  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: queryKeys.regions.districts(regionId ?? ''),
    queryFn: () => getDistricts(regionId!),
    enabled: !!regionId,
    staleTime: 1000 * 60 * 10,
  });

  const handleRegionChange = (value: string) => {
    onRegionChange(value);
    onDistrictChange('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner />
        <span className="text-sm text-muted-foreground">Loading locations...</span>
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
          {loadingDistricts ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-sm text-muted-foreground">Loading districts...</span>
            </div>
          ) : (
            <Select value={districtId ?? ''} onValueChange={onDistrictChange}>
              <SelectTrigger id="district" className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent>
                {(districts ?? []).map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
}
