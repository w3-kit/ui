export interface Token {
  symbol: string;
  name: string;
  logoURI?: string;
  balance?: string;
  price?: number;
  decimals?: number;
  address?: string;
  chainId?: number;
}

export interface TokenListProps {
  tokens: Token[];
  onTokenSelect?: (token: Token) => void;
  className?: string;
}
