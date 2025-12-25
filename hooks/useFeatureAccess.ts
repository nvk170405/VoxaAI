'use client';

import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FEATURE_ACCESS } from '@/lib/constants';
import type { SubscriptionPlan } from '@/types';

interface FeatureAccess {
  maxJournals: number;
  maxGoals: number;
  hasAnalytics: boolean;
  hasAISentiment: boolean;
  hasAIPrompts: boolean;
  hasCloudBackup: boolean;
  storageLimit: number;
}

/**
 * Hook to check feature access based on user's subscription plan
 */
export const useFeatureAccess = () => {
  const { subscription } = useAuth();
  const plan: SubscriptionPlan = subscription || 'basic';

  const features: FeatureAccess = useMemo(() => {
    return FEATURE_ACCESS[plan] || FEATURE_ACCESS.basic;
  }, [plan]);

  const canAccess = (feature: keyof FeatureAccess): boolean => {
    const value = features[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    return false;
  };

  const isPremium = plan === 'premium';

  return {
    plan,
    features,
    canAccess,
    isPremium,
    isBasic: plan === 'basic',
  };
};
