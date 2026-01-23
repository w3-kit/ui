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

export interface TokenListProps {
  tokens: Token[];
  onTokenSelect?: (token: Token) => void;
  className?: string;
  showBalances?: boolean;
  showPrices?: boolean;
  showValue?: boolean;
  variant?: "table" | "grid" | "list";
  selectedToken?: string;
}

export type SortField = "name" | "balance" | "value" | "symbol";
export type SortDirection = "asc" | "desc";
