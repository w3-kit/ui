export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  price?: number;
  chainId: number;
}

export interface TokenSwapWidgetProps {
  onSwap: (fromToken: string, toToken: string, amount: string) => Promise<void>;
  defaultSlippage?: number;
  className?: string;
  tokens?: Token[];
}
