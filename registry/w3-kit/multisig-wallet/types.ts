export interface Signer {
  address: string;
  name?: string;
  hasApproved: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  to: string;
  value: string;
  data: string;
  status: "pending" | "executed" | "rejected";
  approvals: number;
  requiredApprovals: number;
  proposer: string;
  timestamp: number;
  signers: Signer[];
}

export interface MultisigWalletProps {
  walletAddress: string;
  signers: Signer[];
  transactions: Transaction[];
  requiredApprovals: number;
  onPropose?: (tx: Omit<Transaction, "id" | "status" | "timestamp">) => void;
  onApprove?: (txId: string) => void;
  onReject?: (txId: string) => void;
  className?: string;
}

export interface FormErrors {
  description?: string;
  to?: string;
  value?: string;
  data?: string;
  submit?: string;
}
