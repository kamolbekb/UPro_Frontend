import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { Region, District } from '@features/tasks/types/task.types';

/**
 * Get all regions with their districts
 *
 * Returns regions with districts nested for dropdowns/filters.
 *
 * @returns List of regions with districts
 */
export async function getRegions(): Promise<Region[]> {
  const response = await apiClient.get<Region[]>(ENDPOINTS.regions.list);
  return response.data;
}

/**
 * Get region by ID with districts
 *
 * @param id - Region UUID
 * @returns Region with its districts
 */
export async function getRegionById(id: string): Promise<Region> {
  const response = await apiClient.get<Region>(ENDPOINTS.regions.byId(id));
  return response.data;
}

/**
 * Get districts for a specific region
 *
 * @param regionId - Region UUID
 * @returns List of districts in the region
 */
export async function getDistricts(regionId: string): Promise<District[]> {
  const response = await apiClient.get<District[]>(
    ENDPOINTS.regions.districts(regionId)
  );
  return response.data;
}
