export type CheckStatus = "safe" | "warning" | "danger";

export interface SecurityCheck {
  name: string;
  status: CheckStatus;
  description?: string;
}

export interface SmartContractScannerProps {
  address?: string;
  score?: number;
  checks?: SecurityCheck[];
  onScan?: (address: string) => void;
  loading?: boolean;
  className?: string;
}
