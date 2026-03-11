import { useCategories } from '@shared/hooks/useCategories';
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
 * Displays main categories first, then shows subcategories
 * when a parent category is selected.
 *
 * Usage:
 * ```tsx
 * <CategorySelect
 *   categoryId={categoryId}
 *   subCategoryId={subCategoryId}
 *   onCategoryChange={setCategoryId}
 *   onSubCategoryChange={setSubCategoryId}
 * />
 * ```
 */
export function CategorySelect({
  categoryId,
  subCategoryId,
  onCategoryChange,
  onSubCategoryChange,
  error,
}: CategorySelectProps) {
  const { data: categories, isLoading } = useCategories();

  // Get top-level categories (no parent)
  const parentCategories = categories?.filter((cat) => !cat.parentId) ?? [];

  // Get selected parent category
  const selectedParent = categories?.find((cat) => cat.id === categoryId);

  // Get subcategories for selected parent
  const subCategories = selectedParent?.children ?? [];

  /**
   * Handle main category selection
   */
  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
    // Reset subcategory when parent changes
    onSubCategoryChange(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner />
        <span className="text-sm text-gray-500">Loading categories...</span>
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

      {/* Subcategory (only show if parent selected and has children) */}
      {categoryId && subCategories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory (Optional)</Label>
          <Select
            value={subCategoryId ?? ''}
            onValueChange={(value) => onSubCategoryChange(value || undefined)}
          >
            <SelectTrigger id="subcategory">
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
