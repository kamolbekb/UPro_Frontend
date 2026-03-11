import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { BudgetType } from '@features/tasks/types/task.types';

/**
 * Get all budget types
 *
 * @returns List of budget types (Fixed, Hourly, etc.)
 */
export async function getBudgetTypes(): Promise<BudgetType[]> {
  const response = await apiClient.get<BudgetType[]>(ENDPOINTS.budgetTypes.list);
  return response.data;
}
