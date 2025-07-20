import { useSubscription } from "@/context/SubscriptionContext";

export const useFeatureAccess = () => {
  const { plan } = useSubscription();

  const hasAccess = (feature: string): boolean => {
    const accessMap: Record<string, "basic" | "premium"> = {
      "multiLanguageTranscription": "premium",
      "advancedFilters": "premium",
      "personalizedPrompts": "premium",
      "premiumThemes": "premium",
      "aiSentiment": "premium",
      "goalTracking": "premium",
      "integrations": "premium",
      "sharing": "premium",
      "advancedSecurity": "premium",
      "cloud10GB": "premium",
      "offlineMode": "premium",
      "gamificationAdvanced": "premium",
      "analytics": "premium",
    };

    const requiredPlan = accessMap[feature];
    return plan === 'premium' || !requiredPlan || requiredPlan === 'basic';
  };

  return { hasAccess, plan };
};
