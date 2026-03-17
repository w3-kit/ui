export interface SecurityCheck {
  id: string;
  name: string;
  status: "safe" | "warning" | "danger";
  description: string;
}

export interface SmartContractScannerProps {
  className?: string;
  onScan?: (address: string) => void;
}
