import { useState } from 'react';
import { useDebounce } from '@shared/hooks/useDebounce';
import type { TaskFilters, TaskStatus } from '../types/task.types';

/**
 * Manage task search and filter state with debouncing
 *
 * Provides state management for task search inputs with 300ms debounce
 * to prevent excessive API calls while typing.
 *
 * @returns Search state and setter functions
 *
 * @example
 * const {
 *   filters,
 *   debouncedFilters,
 *   setSearchTerm,
 *   setCategory,
 *   setRegion,
 *   resetFilters,
 * } = useTaskSearch();
 *
 * // Use debouncedFilters for API calls
 * const { data } = useTasks(debouncedFilters);
 *
 * // Use filters for immediate UI updates
 * <input value={filters.searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 */
export function useTaskSearch() {
  const [filters, setFilters] = useState<TaskFilters>({
    searchTerm: '',
    page: 1,
    limit: 10,
  });

  // Debounce filters to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 300);

  const setSearchTerm = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm,
      page: 1, // Reset to first page on new search
    }));
  };

  const setCategory = (categoryId: string | undefined, subCategoryId?: string) => {
    setFilters((prev) => {
      const newFilters: TaskFilters = { ...prev, page: 1 };
      if (categoryId) {
        newFilters.categoryId = categoryId;
      } else {
        delete newFilters.categoryId;
      }
      if (subCategoryId) {
        newFilters.subCategoryId = subCategoryId;
      } else {
        delete newFilters.subCategoryId;
      }
      return newFilters;
    });
  };

  const setRegion = (regionId: string | undefined, districtId?: string) => {
    setFilters((prev) => {
      const newFilters: TaskFilters = { ...prev, page: 1 };
      if (regionId) {
        newFilters.regionId = regionId;
      } else {
        delete newFilters.regionId;
      }
      if (districtId) {
        newFilters.districtId = districtId;
      } else {
        delete newFilters.districtId;
      }
      return newFilters;
    });
  };

  const setBudgetType = (budgetTypeId: string | undefined) => {
    setFilters((prev) => {
      const newFilters: TaskFilters = { ...prev, page: 1 };
      if (budgetTypeId) {
        newFilters.budgetTypeId = budgetTypeId;
      } else {
        delete newFilters.budgetTypeId;
      }
      return newFilters;
    });
  };

  const setBudgetRange = (minBudget: number | undefined, maxBudget: number | undefined) => {
    setFilters((prev) => {
      const newFilters: TaskFilters = { ...prev, page: 1 };
      if (minBudget !== undefined) {
        newFilters.minBudget = minBudget;
      } else {
        delete newFilters.minBudget;
      }
      if (maxBudget !== undefined) {
        newFilters.maxBudget = maxBudget;
      } else {
        delete newFilters.maxBudget;
      }
      return newFilters;
    });
  };

  const setStatus = (status: TaskStatus | undefined) => {
    setFilters((prev) => {
      const newFilters: TaskFilters = { ...prev, page: 1 };
      if (status !== undefined) {
        newFilters.status = status;
      } else {
        delete newFilters.status;
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      page: 1,
      limit: 10,
    });
  };

  return {
    filters,
    debouncedFilters,
    setSearchTerm,
    setCategory,
    setRegion,
    setBudgetType,
    setBudgetRange,
    setStatus,
    resetFilters,
  };
}
