export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  logoURI?: string;
}

export interface PriceTickerProps {
  tokens: string[];
  className?: string;
  refreshInterval?: number; // in milliseconds
  onPriceUpdate?: (prices: TokenPrice[]) => void;
  variant?: "compact" | "detailed";
}
