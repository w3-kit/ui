export enum ContractError {
  INVALID_ADDRESS = "Invalid contract address format",
  NOT_FOUND = "Contract not found",
  NOT_VERIFIED = "Contract is not verified",
  NETWORK_ERROR = "Network connection error",
  SCAN_FAILED = "Contract scanning failed",
  RATE_LIMIT = "API rate limit exceeded",
  TIMEOUT = "Request timeout",
  UNKNOWN = "An unknown error occurred",
}

export interface SecurityCheck {
  id: string;
  name: string;
  status: "safe" | "warning" | "danger";
  description: string;
  details?: string;
}

export interface ContractFunction {
  name: string;
  type: "read" | "write";
  inputs: { name: string; type: string }[];
  outputs: { type: string }[];
  stateMutability: string;
}

export interface ContractInfo {
  name: string;
  address: string;
  network: string;
  verified: boolean;
  license: string;
  compiler: string;
  securityScore: number;
  checks: SecurityCheck[];
  functions: ContractFunction[];
  sourceCode?: string;
}

export interface SmartContractScannerProps {
  className?: string;
  variant?: "default" | "compact";
  onScan?: (address: string) => void;
  onError?: (error: ContractError) => void;
}
