export type ButtonVariant = 'ghost' | 'light' | 'dark';
export type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'phantom';

export interface ConnectWalletButtonProps {
  onConnect?: (address: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  customLabel?: string;
  variant?: ButtonVariant;
  walletType?: WalletType;
  walletConnectConfig?: WalletConnectConfig;
}

export interface WalletConnectConfig {
  rpc: Record<number, string>;
  bridge?: string;
}

export interface CoinbaseWalletProvider {
  request: (args: { method: string }) => Promise<string[]>;
}

export interface SolanaProvider {
  connect(): Promise<{ publicKey: { toString(): string } }>;
}

export interface WalletIconConfig {
  metamask: string;
  walletconnect: string;
  coinbase: string;
  phantom: string;
}
