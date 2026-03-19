import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { BudgetType } from '@features/tasks/types/task.types';

/**
 * Hardcoded budget types — the /api/BudgetTypes endpoint is not implemented on the backend (returns 404).
 * These match the backend's paymentTypeId values.
 */
const FALLBACK_BUDGET_TYPES: BudgetType[] = [
  { id: '1', name: "Kelishilgan narx" },
  { id: '2', name: "Soatiga" },
];

/**
 * Get all budget types
 *
 * Tries the backend first; falls back to hardcoded values if the endpoint is unavailable.
 *
 * @returns List of budget types
 */
export async function getBudgetTypes(): Promise<BudgetType[]> {
  try {
    const response = await apiClient.get<BudgetType[]>(ENDPOINTS.budgetTypes.list);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    return FALLBACK_BUDGET_TYPES;
  } catch {
    return FALLBACK_BUDGET_TYPES;
  }
}
