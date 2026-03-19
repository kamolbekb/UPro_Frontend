import { apiClient } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';
import type {
  SubscriptionPlan,
  UserSubscription,
  SubscribeRequest,
} from '../types/subscription.types';

/**
 * Get all available subscription plans
 *
 * @returns List of subscription plans
 */
export async function getPlans(): Promise<SubscriptionPlan[]> {
  const response = await apiClient.get<SubscriptionPlan[]>(ENDPOINTS.subscriptions.plans);
  return response.data;
}

/**
 * Get current user's subscription
 *
 * @returns User subscription details
 */
export async function getMySubscription(): Promise<UserSubscription> {
  const response = await apiClient.get<UserSubscription>(
    ENDPOINTS.subscriptions.mySubscription
  );
  return response.data;
}

/**
 * Subscribe to a plan
 *
 * @param data - Plan ID to subscribe to
 * @returns Updated subscription details
 */
export async function subscribe(data: SubscribeRequest): Promise<UserSubscription> {
  const response = await apiClient.post<UserSubscription>(
    ENDPOINTS.subscriptions.subscribe,
    data
  );
  return response.data;
}

/**
 * Cancel current subscription
 *
 * @returns Success boolean
 */
export async function cancelSubscription(): Promise<boolean> {
  const response = await apiClient.post<boolean>(ENDPOINTS.subscriptions.cancel);
  return response.data;
}
