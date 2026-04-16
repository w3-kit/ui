export interface Position {
  id: string;
  protocol: string;
  protocolIcon?: string;
  token: string;
  tokenIcon?: string;
  amount: string;
  value: string;
  healthFactor?: number;
  apy: number;
  risk: "low" | "medium" | "high";
}

export interface DeFiPositionManagerProps {
  positions: Position[];
  onPositionClick?: (position: Position) => void;
  className?: string;
}
