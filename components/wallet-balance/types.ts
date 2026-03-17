export interface Token {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  decimals: number;
  logoURI: string;
  priceChange24h?: number;
}

export interface WalletBalanceProps {
  tokens: Token[];
  onTokenClick?: (token: Token) => void;
  className?: string;
}
