export interface GasSpeed {
  name: string;
  gwei: number;
  time: string;
  cost: string;
}

export interface GasTxType {
  key: string;
  label: string;
  icon?: "transfer" | "swap" | "nft" | "contract";
  gasLimit: number;
}

export interface GasCalculatorProps {
  speeds: GasSpeed[];
  selectedSpeed?: string;
  onSelect?: (speed: GasSpeed) => void;
  ethPrice?: number;
  txTypes?: GasTxType[];
  selectedTxType?: string;
  onSelectTxType?: (txType: GasTxType) => void;
  baseFeeGwei?: number;
  /** Network name shown in the footer when set (e.g. `"Ethereum mainnet"`). */
  network?: string;
  className?: string;
}
