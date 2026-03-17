export interface Token {
  symbol: string;
  name: string;
  logoURI?: string;
  decimals: number;
  address?: string;
  balance?: string;
  price?: number;
}

export interface TokenSwapWidgetProps {
  onSwap: (fromToken: string, toToken: string, amount: string) => Promise<void>;
  tokens?: Token[];
  className?: string;
}
