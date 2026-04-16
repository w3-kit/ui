export interface TickerToken {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  marketCap?: number;
  volume24h?: number;
  logoURI?: string;
}

export interface PriceTickerProps {
  tokens: TickerToken[];
  onTokenClick?: (token: TickerToken) => void;
  className?: string;
}
