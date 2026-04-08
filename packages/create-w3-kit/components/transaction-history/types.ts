export type TransactionStatus = "pending" | "success" | "failed";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: TransactionStatus;
  gasUsed?: string;
  gasPrice?: string;
  nonce: number;
  blockNumber?: number;
}

export interface TransactionHistoryProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  className?: string;
  itemsPerPage?: number;
}
