export interface Signer {
  /** Signer wallet address */
  address: string;
  /** Display name */
  name?: string;
  /** Whether this signer has approved the current transaction */
  hasApproved: boolean;
}

export interface Transaction {
  /** Unique transaction ID */
  id: string;
  /** Human-readable description */
  description: string;
  /** Recipient address */
  to: string;
  /** ETH value as string */
  value: string;
  /** Transaction status */
  status: "pending" | "executed" | "rejected";
  /** Number of current approvals */
  approvals: number;
  /** Required approvals to execute */
  requiredApprovals: number;
  /** Unix timestamp */
  timestamp: number;
  /** Per-signer approval status */
  signers: Signer[];
}

export interface MultisigWalletProps {
  /** Multisig wallet address */
  walletAddress: string;
  /** List of signers */
  signers: Signer[];
  /** List of transactions */
  transactions: Transaction[];
  /** Required approvals threshold */
  requiredApprovals: number;
  /** Called when user approves a transaction */
  onApprove?: (txId: string) => void;
  /** Called when user rejects a transaction */
  onReject?: (txId: string) => void;
  /** Called when user clicks propose new transaction */
  onPropose?: () => void;
  /** Transaction ID currently being approved (loading) */
  approvingId?: string;
  /** Additional CSS classes */
  className?: string;
}
