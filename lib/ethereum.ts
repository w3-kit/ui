export interface EIP1193Provider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

export interface CoinbaseWalletProvider {
  request: (args: { method: string }) => Promise<string[]>;
}

export interface SolanaProvider {
  connect(): Promise<{ publicKey: { toString(): string } }>;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    coinbaseWalletExtension?: CoinbaseWalletProvider;
    solana?: SolanaProvider;
    phantom?: { solana?: SolanaProvider };
  }
}
