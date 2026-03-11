import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Category } from '@features/tasks/types/task.types';

/**
 * Get all categories with hierarchical structure
 *
 * Returns categories with their subcategories nested in a tree structure.
 * Categories with parentId=null are root categories.
 *
 * @returns Hierarchical category list
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>(ENDPOINTS.categories.list);
  return response.data;
}

/**
 * Get category by ID
 *
 * @param id - Category UUID
 * @returns Category with its subcategories
 */
export async function getCategoryById(id: string): Promise<Category> {
  const response = await apiClient.get<Category>(ENDPOINTS.categories.byId(id));
  return response.data;
}

/**
 * Search categories by name
 *
 * @param searchTerm - Search keyword
 * @returns Matching categories
 */
export async function searchCategories(searchTerm: string): Promise<Category[]> {
  const params = new URLSearchParams({ searchTerm });
  const url = `${ENDPOINTS.categories.search}?${params.toString()}`;
  const response = await apiClient.get<Category[]>(url);
  return response.data;
}
