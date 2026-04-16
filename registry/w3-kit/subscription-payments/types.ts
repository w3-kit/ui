export interface Plan {
  id: string;
  name: string;
  price: string;
  token: string;
  interval: string;
  features: string[];
  popular?: boolean;
}

export interface SubscriptionPaymentsProps {
  plans: Plan[];
  onSubscribe?: (planId: string) => void;
  subscribingId?: string;
  className?: string;
}
