export interface ListToken {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  logoURI?: string;
}

export interface TokenListProps {
  tokens: ListToken[];
  onTokenSelect?: (token: ListToken) => void;
  className?: string;
}
