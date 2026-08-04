/**
 * Public types for the <ChainSelector /> component.
 *
 * A "chain" here is the unit of choice shown to the user. It is intentionally
 * chain-agnostic: the `ecosystem` field tells consumers (TokenCreate, etc.)
 * which form/contract stack to render, and `chainId` is either a number
 * (EVM) or a string slot (Solana mainnet = "mainnet-beta", etc.).
 */

export type ChainEcosystem = "evm" | "solana";

export interface Chain {
  /** Stable identifier — EVM chainId as number, Solana cluster as string. */
  chainId: number | string;
  /** Display name (e.g. "Ethereum", "Solana", "Polygon"). */
  name: string;
  /** Short ticker used for icons and labels (e.g. "ETH", "SOL", "MATIC"). */
  symbol?: string;
  /** Brand color hex; falls back to a neutral gray in the component. */
  color?: string;
  /** Image URL or React node rendered as the chain icon. */
  icon?: string | React.ReactNode;
  /** Ecosystem bucket; drives downstream form rendering. */
  ecosystem: ChainEcosystem;
  /** Native currency symbol (e.g. "ETH", "SOL"). */
  currency?: string;
  /** Marked as testnet — toggled separately in the UI when `showTestnetToggle` is on. */
  testnet?: boolean;
  /** Explorer host (e.g. "etherscan.io", "solscan.io"). Used by TokenCreate for links. */
  explorerHost?: string;
}

export interface ChainSelectorProps {
  /** All available chains (EVM + Solana mixed is fine). */
  chains: Chain[];
  /** Currently selected chain's `chainId`. */
  selectedChainId?: number | string;
  /** Called with the new chain's `chainId` when the user picks. */
  onSelect: (chainId: number | string) => void;
  /** Show search input. */
  searchable?: boolean;
  /** Show the Mainnet/Testnet toggle. Defaults to true if any chain has `testnet: true`. */
  showTestnetToggle?: boolean;
  /** Additional CSS classes on the root container. */
  className?: string;
}
