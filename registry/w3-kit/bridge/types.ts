export interface BridgeNetwork {
  /** Chain ID (e.g. 1 for Ethereum) */
  id: number;
  /** Display name */
  name: string;
  /** Network icon URL */
  icon?: string;
  /** Brand color hex */
  color?: string;
}

export interface BridgeToken {
  /** Token ticker symbol */
  symbol: string;
  /** Full token name */
  name: string;
  /** Token icon URL */
  icon?: string;
  /** Formatted user balance */
  balance?: string;
}

export interface BridgeWidgetProps {
  /** Available networks for bridging */
  networks: BridgeNetwork[];
  /** Available tokens */
  tokens: BridgeToken[];
  /** Currently selected source network */
  fromNetwork?: BridgeNetwork;
  /** Currently selected destination network */
  toNetwork?: BridgeNetwork;
  /** Currently selected token */
  selectedToken?: BridgeToken;
  /** Called when user clicks the bridge button */
  onBridge?: (params: {
    from: BridgeNetwork;
    to: BridgeNetwork;
    token: BridgeToken;
    amount: string;
  }) => void;
  /** Called when user changes the source network */
  onFromNetworkChange?: (network: BridgeNetwork) => void;
  /** Called when user changes the destination network */
  onToNetworkChange?: (network: BridgeNetwork) => void;
  /** Called when user changes the token */
  onTokenChange?: (token: BridgeToken) => void;
  /** Show loading state on the bridge button */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
