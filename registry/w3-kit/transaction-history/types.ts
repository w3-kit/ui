export interface Transaction {
  hash: string;
  type: "send" | "receive" | "swap" | "approve" | "contract";
  status: "success" | "pending" | "failed";
  value: string;
  tokenSymbol?: string;
  from: string;
  to: string;
  timestamp: number;
  description?: string;
}

export interface TransactionHistoryProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  className?: string;
}
