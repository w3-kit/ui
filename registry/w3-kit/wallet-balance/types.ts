export interface Token {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  decimals: number;
  logoURI: string;
  priceChange24h?: number;
  lastUpdated?: string;
}

export interface WalletBalanceProps {
  tokens: Token[];
  onTokenClick?: (token: Token) => void;
  className?: string;
  variant?: "default" | "compact";
  onRefresh?: () => Promise<void>;
}

export type SortOption = "balance" | "name" | "value" | "change";
