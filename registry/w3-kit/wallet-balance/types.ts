export interface Token {
  /** Token symbol (e.g. "ETH") */
  symbol: string;
  /** Token display name (e.g. "Ethereum") */
  name: string;
  /** User's balance as a formatted string (e.g. "1.4201") */
  balance: string;
  /** Current price in USD */
  price: number;
  /** Token decimals (used for formatting) */
  decimals?: number;
  /** Token logo URL */
  logoURI?: string;
  /** 24h price change percentage */
  priceChange24h?: number;
  /** Brand color hex (used in allocation bar) */
  color?: string;
}

export interface WalletBalanceProps {
  /** List of tokens with balances */
  tokens: Token[];
  /** Called when user clicks a token row */
  onTokenClick?: (token: Token) => void;
  /** Called when user clicks send on a token */
  onSend?: (token: Token) => void;
  /** Called when user clicks swap on a token */
  onSwap?: (token: Token) => void;
  /** Called when user clicks refresh */
  onRefresh?: () => void | Promise<void>;
  /** Show allocation bar */
  showAllocation?: boolean;
  /** Additional CSS classes */
  className?: string;
}
