export interface TokenCardData {
  symbol: string;
  name: string;
  price: number;
  balance?: number;
  priceChange24h?: number;
  logoURI?: string;
}

export interface TokenCardProps {
  token: TokenCardData;
  onClick?: (token: TokenCardData) => void;
  className?: string;
}
