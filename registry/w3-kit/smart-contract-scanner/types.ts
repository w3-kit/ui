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
  riskLabel?: string; // e.g. "Low Risk", overrides auto-derived label
  exampleAddress?: string; // shown as a "Try: ..." quick-fill on idle
  onScan?: (address: string) => void;
  onReset?: () => void;
  loading?: boolean;
  className?: string;
}
