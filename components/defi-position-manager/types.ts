export interface PositionData {
  id: string;
  protocol: { name: string; logoURI: string; type: "lending" | "borrowing" | "farming" };
  token: { symbol: string; logoURI: string; price: number };
  amount: string;
  value: number;
  healthFactor: number;
  apy: number;
  rewards: { token: string; amount: string; value: number }[];
  risk: "low" | "medium" | "high";
  lastUpdate: number;
}

export interface DeFiPositionManagerProps {
  positions: PositionData[];
  className?: string;
}
