/**
 * Subscription types
 * Maps to backend Subscription entity and DTOs
 */

/**
 * Subscription plan available for purchase
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationInDays: number;
  maxTasksPerMonth: number | null;
  maxApplicationsPerMonth: number | null;
  maxSavedTasks: number | null;
  isActive: boolean;
}

/**
 * User's current subscription
 */
export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxTasksPerMonth: number | null;
  maxApplicationsPerMonth: number | null;
  maxSavedTasks: number | null;
}

/**
 * Request to subscribe to a plan
 */
export interface SubscribeRequest {
  subscriptionPlanId: string;
}
