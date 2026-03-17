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
  onTokenClick?: (token: Token) => void;
}
