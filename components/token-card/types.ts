export interface Token {
  symbol: string;
  name: string;
  logoURI?: string;
  price?: number;
  priceChange24h?: number;
  balance?: string;
  decimals?: number;
  chainId?: number;
  address?: string;
}

export interface TokenCardProps {
  token: Token;
  onClick?: (token: Token) => void;
  className?: string;
}
