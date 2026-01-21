export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  price?: number;
  value?: number;
  chainId: number;
}

export interface ExtendedToken extends Token {
  priceChange24h?: number;
  verified?: boolean;
  marketCap?: number;
  volume24h?: number;
  allTimeHigh?: number;
  allTimeHighDate?: string;
  rank?: number;
}

export interface TokenCardProps {
  token: ExtendedToken;
  variant?: "default" | "compact" | "expanded" | "minimal";
  onClick?: (token: ExtendedToken) => void;
  showBalance?: boolean;
  showPrice?: boolean;
  showPriceChange?: boolean;
  onFavoriteToggle?: (token: ExtendedToken, isFavorite: boolean) => void;
}
