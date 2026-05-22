export interface Plan {
  id: string;
  name: string;
  price: string;
  token: string;
  interval: string;
  features: string[];
  popular?: boolean;
  description?: string;
}

export interface SubscriptionPaymentsProps {
  plans: Plan[];
  onSubscribe?: (planId: string) => void;
  subscribingId?: string;
  subscribedId?: string; // plan the user is currently subscribed to
  emptyMessage?: string;
  className?: string;
}
