export interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  logoURI?: string;
}

export interface Token {
  name: string;
  symbol: string;
  price: number;
  priceChange: {
    "1h": number;
    "24h": number;
    "7d": number;
    "30d": number;
  };
  marketCap: number;
  volume: {
    "24h": number;
  };
  circulatingSupply: number;
  maxSupply: number | null;
  logoURI: string;
  lastUpdated: string;
}

export interface PriceTickerProps {
  tokens: Token[];
  className?: string;
  refreshInterval?: number;
  onPriceUpdate?: (prices: TokenPrice[]) => void;
  variant?: "compact" | "detailed";
}
