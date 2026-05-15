export interface WalletOption {
  /** Unique wallet identifier */
  id: string;
  /** Display name */
  name: string;
  /** Icon URL or React node */
  icon: string | React.ReactNode;
  /** Whether to highlight this wallet as a popular option */
  popular?: boolean;
  /** Ecosystem: "evm" | "solana" | "both" */
  ecosystem?: "evm" | "solana" | "both";
  /** Whether this wallet is installed/detected */
  installed?: boolean;
  /** Install URL (shown when not installed) */
  installUrl?: string;
}

export interface ConnectedAccount {
  /** Wallet address */
  address: string;
  /** ID of the wallet used to connect */
  walletId: string;
}

export interface Chain {
  /** Chain ID (e.g. 1 for Ethereum) */
  chainId: number;
  /** Display name */
  name: string;
  /** Brand color hex */
  color?: string;
  /** Chain icon URL */
  icon?: string;
}

export interface ConnectWalletProps {
  /** List of wallets to display */
  wallets: WalletOption[];
  /** Connected account data. null = show wallet picker */
  connectedAccount?: ConnectedAccount | null;
  /** Called when user selects a wallet to connect */
  onConnect: (walletId: string) => void;
  /** Called when user clicks disconnect */
  onDisconnect?: () => void;
  /** Supported chains for the chain switcher */
  chains?: Chain[];
  /** Currently active chain */
  activeChain?: Chain;
  /** Called when user switches chain */
  onChainSwitch?: (chainId: number) => void;
  /** ID of the most recently used wallet (shown highlighted) */
  recentWalletId?: string;
  /** "default" = full picker card, "compact" = button that opens dropdown */
  variant?: "default" | "compact";
  /** Show loading spinner on the connecting wallet */
  loading?: boolean;
  /** Additional CSS classes on the root element */
  className?: string;
}
