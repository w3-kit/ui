import { TokenSymbol } from '../../config/tokens';

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
  tokens: TokenSymbol[] | Token[];  // Allow both symbol array or token array
  onTokenSelect?: (token: Token) => void;
  className?: string;
  showBalances?: boolean;
  showPrices?: boolean;
  showValue?: boolean;
  variant?: 'table' | 'grid' | 'list';
  selectedToken?: TokenSymbol;
}

export type SortField = 'name' | 'balance' | 'value' | 'symbol';
export type SortDirection = 'asc' | 'desc'; 