export interface FlashLoanProtocol {
  /** Unique protocol identifier */
  id: string;
  /** Display name */
  name: string;
  /** Icon URL */
  icon?: string;
  /** Fee rate (e.g. 0.0009 for 0.09%) */
  fee: number;
  /** Contract address */
  address?: string;
}

export interface FlashLoanToken {
  /** Token symbol (e.g. "USDC") */
  symbol: string;
  /** Display name (e.g. "USD Coin") */
  name: string;
  /** Icon URL */
  icon?: string;
  /** Token decimals */
  decimals?: number;
  /** Token contract address */
  address?: string;
}

export interface FlashLoanExecutorProps {
  /** Available protocols */
  protocols: FlashLoanProtocol[];
  /** Available tokens */
  tokens: FlashLoanToken[];
  /** Controlled selected protocol */
  selectedProtocol?: FlashLoanProtocol;
  /** Controlled selected token */
  selectedToken?: FlashLoanToken;
  /** Called when the user clicks execute */
  onExecute?: (data: {
    protocol: FlashLoanProtocol;
    token: FlashLoanToken;
    amount: string;
  }) => void | Promise<void>;
  /** Called when protocol selection changes */
  onProtocolChange?: (protocol: FlashLoanProtocol) => void;
  /** Called when token selection changes */
  onTokenChange?: (token: FlashLoanToken) => void;
  /** Show loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
