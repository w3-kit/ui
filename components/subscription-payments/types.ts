export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  priceUsd?: string;
  token: { symbol: string; logoURI: string; decimals: number };
  interval: "daily" | "weekly" | "monthly" | "yearly";
  features: string[];
  description: string;
  icon: "sparkles" | "zap" | "shield";
  isPopular?: boolean;
}

export interface SubscriptionPaymentsProps {
  plans: SubscriptionPlan[];
  onSubscribe?: (planId: string) => void;
  loadingPlanId?: string;
  className?: string;
}
