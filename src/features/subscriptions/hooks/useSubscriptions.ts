import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getPlans,
  getMySubscription,
  subscribe,
  cancelSubscription,
} from '../api/subscriptionApi';
import { queryKeys } from '@shared/constants/queryKeys';
import type { SubscribeRequest } from '../types/subscription.types';

/**
 * Hook to fetch available subscription plans
 */
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: queryKeys.subscriptions.plans(),
    queryFn: getPlans,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch current user's subscription
 */
export function useMySubscription() {
  return useQuery({
    queryKey: queryKeys.subscriptions.mySubscription(),
    queryFn: getMySubscription,
  });
}

/**
 * Hook to subscribe to a plan
 */
export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubscribeRequest) => subscribe(data),
    onSuccess: () => {
      toast.success('Successfully subscribed!');
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
    onError: (error) => {
      console.error('Failed to subscribe:', error);
    },
  });
}

/**
 * Hook to cancel subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast.success('Subscription cancelled.');
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.all });
    },
    onError: (error) => {
      console.error('Failed to cancel subscription:', error);
    },
  });
}
