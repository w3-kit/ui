export interface SwapToken {
  /** Token symbol (e.g. "ETH") */
  symbol: string;
  /** Display name */
  name: string;
  /** Token logo URL */
  icon?: string;
  /** User's balance (formatted string) */
  balance?: string;
  /** Current price in USD */
  price?: number;
}

export interface TokenSwapProps {
  /** Available tokens for selection */
  tokens: SwapToken[];
  /** Currently selected "from" token */
  fromToken?: SwapToken;
  /** Currently selected "to" token */
  toToken?: SwapToken;
  /** Called when user initiates a swap */
  onSwap: (params: { from: SwapToken; to: SwapToken; amount: string }) => void | Promise<void>;
  /** Called when user changes the from token */
  onFromTokenChange?: (token: SwapToken) => void;
  /** Called when user changes the to token */
  onToTokenChange?: (token: SwapToken) => void;
  /** Exchange rate: how many toTokens per 1 fromToken */
  exchangeRate?: number;
  /** Slippage tolerance percentage */
  slippage?: number;
  /** Show loading state on swap button */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
