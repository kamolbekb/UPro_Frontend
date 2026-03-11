import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Category } from '@features/tasks/types/task.types';

/**
 * Get parent categories
 *
 * Returns top-level categories only.
 *
 * @returns Parent category list
 */
export async function getParentCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>(ENDPOINTS.categories.parents);
  return response.data;
}

/**
 * Get subcategories
 *
 * @param parentId - Optional parent category ID to filter by
 * @param limit - Optional limit for number of results
 * @returns Subcategory list
 */
export async function getSubcategories(
  parentId?: string,
  limit?: number
): Promise<Category[]> {
  const params = new URLSearchParams();
  if (parentId) params.append('parentId', parentId);
  if (limit) params.append('limit', limit.toString());

  const url = params.toString()
    ? `${ENDPOINTS.categories.subcategories}?${params.toString()}`
    : ENDPOINTS.categories.subcategories;

  const response = await apiClient.get<Category[]>(url);
  return response.data;
}

/**
 * Search subcategories by name
 *
 * @param searchTerm - Search keyword
 * @returns Matching subcategories
 */
export async function searchCategories(searchTerm?: string): Promise<Category[]> {
  const params = new URLSearchParams();
  if (searchTerm) params.append('searchTerm', searchTerm);

  const url = params.toString()
    ? `${ENDPOINTS.categories.search}?${params.toString()}`
    : ENDPOINTS.categories.search;

  const response = await apiClient.get<Category[]>(url);
  return response.data;
}
