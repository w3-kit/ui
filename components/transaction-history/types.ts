export type TransactionStatus = "pending" | "success" | "failed";
export type TransactionType = "send" | "receive" | "contract" | "approve" | "swap";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: TransactionStatus;
  type: TransactionType;
  nonce: number;
  blockNumber?: number;
  tokenSymbol?: string;
}

export interface TransactionHistoryProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  className?: string;
}
