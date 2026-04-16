export interface LimitOrder {
  id: string;
  type: "buy" | "sell";
  token: string;
  tokenIcon?: string;
  amount: string;
  price: string;
  status: "active" | "filled" | "cancelled";
  timestamp: number;
}

export interface LimitOrderManagerProps {
  orders: LimitOrder[];
  onCancel?: (orderId: string) => void;
  onCreateOrder?: () => void;
  cancellingId?: string;
  className?: string;
}
