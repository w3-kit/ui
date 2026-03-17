export interface GasPrice {
  low: number;
  medium: number;
  high: number;
  baseFee: number;
}

export interface GasCalculatorProps {
  className?: string;
  onGasSelect?: (gas: number, price: number) => void;
  chainId?: number;
  ethPrice?: number;
}
