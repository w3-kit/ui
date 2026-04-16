export interface GasSpeed {
  name: string;
  gwei: number;
  time: string;
  cost: string;
}

export interface GasCalculatorProps {
  speeds: GasSpeed[];
  selectedSpeed?: string;
  onSelect?: (speed: GasSpeed) => void;
  ethPrice?: number;
  className?: string;
}
