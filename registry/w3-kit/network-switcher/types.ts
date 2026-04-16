export interface Network {
  /** Chain ID (e.g. 1 for Ethereum mainnet) */
  chainId: number;
  /** Display name */
  name: string;
  /** Native currency symbol (e.g. "ETH") */
  symbol?: string;
  /** Native currency name (e.g. "Ether") */
  currency?: string;
  /** RPC endpoint URL */
  rpcUrl?: string;
  /** Block explorer URL */
  blockExplorer?: string;
  /** Network icon URL */
  icon?: string;
  /** Brand color hex (used for the dot indicator) */
  color?: string;
  /** Whether this is a testnet */
  testnet?: boolean;
}

export interface NetworkSwitcherProps {
  /** All available networks (mainnets + testnets) */
  networks: Network[];
  /** Currently active chain ID */
  activeChainId?: number;
  /** Called when user selects a network */
  onSwitch: (chainId: number) => void | Promise<void>;
  /** Show a search input (useful when > 5 networks) */
  searchable?: boolean;
  /** Show testnet toggle (auto-detected from network.testnet field) */
  showTestnetToggle?: boolean;
  /** Currently switching to this chain ID (shows loading spinner) */
  switchingTo?: number;
  /** Additional CSS classes */
  className?: string;
}
