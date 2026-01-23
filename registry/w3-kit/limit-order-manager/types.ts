export interface OrderData {
  id: string;
  type: "limit" | "stop-loss";
  token: {
    symbol: string;
    logoURI: string;
    price: number;
  };
  amount: string;
  price: string;
  status: "active" | "executed" | "cancelled";
  timestamp: number;
  expiry?: number;
}

export interface LimitOrderManagerProps {
  orders: OrderData[];
  onOrderCreate?: (order: Omit<OrderData, "id" | "timestamp">) => void;
  onOrderCancel?: (orderId: string) => void;
  className?: string;
}

export interface FormErrors {
  amount?: string;
  price?: string;
  expiry?: string;
}
