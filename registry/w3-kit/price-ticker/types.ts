export interface TickerToken {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  marketCap?: number;
  volume24h?: number;
  logoURI?: string;
  /** Recent price points used to render the inline trend sparkline. */
  sparkline?: number[];
}

export interface PriceTickerProps {
  tokens: TickerToken[];
  onTokenClick?: (token: TickerToken) => void;
  emptyMessage?: string;
  className?: string;
}
