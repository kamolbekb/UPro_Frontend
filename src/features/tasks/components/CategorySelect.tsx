import { useCategories } from '@shared/hooks/useCategories';
import { useQuery } from '@tanstack/react-query';
import { getSubcategories } from '@shared/api/categoryApi';
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

interface CategorySelectProps {
  categoryId?: string | undefined;
  subCategoryId?: string | undefined;
  onCategoryChange: (categoryId: string) => void;
  onSubCategoryChange: (subCategoryId: string | undefined) => void;
  error?: string | undefined;
}

/**
 * Hierarchical category selector with parent → subcategory dropdown
 *
 * Fetches parent categories on mount, then fetches subcategories
 * when a parent category is selected.
 */
export function CategorySelect({
  categoryId,
  subCategoryId,
  onCategoryChange,
  onSubCategoryChange,
  error,
}: CategorySelectProps) {
  const { data: categories, isLoading } = useCategories();

  // Fetch subcategories when a parent category is selected
  const { data: subCategories, isLoading: loadingSubs } = useQuery({
    queryKey: queryKeys.categories.subcategories(categoryId ?? ''),
    queryFn: () => getSubcategories(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 10,
  });

  // All returned categories are parents (backend returns flat list from /parents)
  const parentCategories = categories ?? [];

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
    onSubCategoryChange(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner />
        <span className="text-sm text-muted-foreground">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Category */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select value={categoryId ?? ''} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category" className={error ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {parentCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Subcategory (only show if parent selected) */}
      {categoryId && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory (Optional)</Label>
          {loadingSubs ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner />
              <span className="text-sm text-muted-foreground">Loading subcategories...</span>
            </div>
          ) : (subCategories?.length ?? 0) > 0 ? (
            <Select
              value={subCategoryId ?? ''}
              onValueChange={(value) => onSubCategoryChange(value || undefined)}
            >
              <SelectTrigger id="subcategory">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subCategories!.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">No subcategories available</p>
          )}
        </div>
      )}
    </div>
  );
}
