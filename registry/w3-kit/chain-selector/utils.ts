import type { Chain } from "./types";

/**
 * Sensible defaults so consumers can drop the component in with no setup.
 * Stable chains only — no testnets.
 */
export const defaultEvmChains: Chain[] = [
  {
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    color: "#627eea",
    ecosystem: "evm",
    currency: "ETH",
    explorerHost: "etherscan.io",
  },
  {
    chainId: 137,
    name: "Polygon",
    symbol: "MATIC",
    color: "#8247e5",
    ecosystem: "evm",
    currency: "MATIC",
    explorerHost: "polygonscan.com",
  },
  {
    chainId: 10,
    name: "Optimism",
    symbol: "OP",
    color: "#ff0420",
    ecosystem: "evm",
    currency: "ETH",
    explorerHost: "optimistic.etherscan.io",
  },
  {
    chainId: 42161,
    name: "Arbitrum",
    symbol: "ARB",
    color: "#28a0f0",
    ecosystem: "evm",
    currency: "ETH",
    explorerHost: "arbiscan.io",
  },
  {
    chainId: 8453,
    name: "Base",
    symbol: "BASE",
    color: "#0052ff",
    ecosystem: "evm",
    currency: "ETH",
    explorerHost: "basescan.org",
  },
];

export const defaultSolanaChains: Chain[] = [
  {
    chainId: "mainnet-beta",
    name: "Solana",
    symbol: "SOL",
    color: "#9945ff",
    ecosystem: "solana",
    currency: "SOL",
    explorerHost: "solscan.io",
  },
  {
    chainId: "devnet",
    name: "Solana Devnet",
    symbol: "SOL",
    color: "#9945ff",
    ecosystem: "solana",
    currency: "SOL",
    testnet: true,
    explorerHost: "solscan.io",
  },
];

export const defaultChains: Chain[] = [...defaultEvmChains, ...defaultSolanaChains];

/** Build an explorer link for a tx hash on the given chain. */
export function explorerTxUrl(chain: Chain, txHash: string): string | null {
  if (!chain.explorerHost || !txHash) return null;
  return `https://${chain.explorerHost}/tx/${txHash}`;
}

/** Build an explorer link for an address on the given chain. */
export function explorerAddressUrl(chain: Chain, address: string): string | null {
  if (!chain.explorerHost || !address) return null;
  // Solana's token-address pages use `/token/` rather than `/address/`.
  const path = chain.ecosystem === "solana" ? "token" : "address";
  return `https://${chain.explorerHost}/${path}/${address}`;
}
