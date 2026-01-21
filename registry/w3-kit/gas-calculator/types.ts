export interface GasPrice {
  low: number;
  medium: number;
  high: number;
  baseFee: number;
  lastBlock: number;
}

export interface GasEstimate {
  gasLimit: number;
  estimatedCost: {
    low: string;
    medium: string;
    high: string;
  };
}

export interface GasCalculatorProps {
  className?: string;
  onGasSelect?: (gas: number, price: number) => void;
  refreshInterval?: number;
  chainId?: number;
}

export interface GasPreset {
  label: string;
  gasLimit: number;
  icon: React.ReactNode;
}
