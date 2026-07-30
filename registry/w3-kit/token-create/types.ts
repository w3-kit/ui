import type { Chain } from "../chain-selector/types";

/**
 * Form-data shape for the EVM (ERC-20) path.
 *
 * `mintable`/`burnable` map directly to toggles on the ERC-20 template:
 * an OpenZeppelin-style ERC20 with optional `_mint` owner and `burn(address,value)`.
 */
export interface EvmTokenFormData {
  name: string;
  symbol: string;
  /** 0-18; OpenZeppelin's default is 18. Most stablecoins use 6 or 8. */
  decimals: number;
  /** Whole-token amount (the component scales by `decimals`). */
  initialSupply: string;
  /** Permission to mint more after deployment. */
  mintable: boolean;
  /** Permission to burn supply after deployment. */
  burnable: boolean;
}

/**
 * Form-data shape for the Solana (SPL) path.
 *
 * SPL Token mints always have a *mint authority* — the address allowed to
 * mint additional supply. The form lets the user keep it (so they can mint
 * more later) or renounce it (fixed supply, similar to "burnable" semantics
 * on the EVM side — but the SPL standard calls it "renouncing the mint
 * authority").
 */
export interface SolanaTokenFormData {
  name: string;
  symbol: string;
  /** 0-9; SPL tokens default to 9. Most use 6 or 9. */
  decimals: number;
  initialSupply: string;
  /** "self" = creator keeps the mint authority. "renounced" = fixed supply. */
  mintAuthority: "self" | "renounced";
}

/**
 * Payload delivered to `onDeploy`. The consumer is expected to branch on
 * `family` — ERC-20 path on EVM, SPL on Solana — using whichever SDK /
 * contract template fits their stack.
 */
export interface DeployRequest {
  chain: Chain;
  family: "evm" | "solana";
  data: EvmTokenFormData | SolanaTokenFormData;
}

export interface DeployResult {
  /** The deployed token / mint address. */
  address: string;
  /** Deploy transaction hash (used for explorer links). */
  txHash: string;
}

export interface TokenCreateProps {
  /** Available chains rendered in <ChainSelector />. */
  chains: Chain[];
  /** Initial selected chain (`chainId`). Undefined = no selection. */
  defaultChainId?: number | string;
  /**
   * Called when the user reaches the preview step and clicks "Deploy".
   *
   * Implementations should resolve with the deploy result or reject with
   * an Error. The component handles loading / error UX; it does **not**
   * talk to wallets or RPCs itself.
   */
  onDeploy: (req: DeployRequest) => Promise<DeployResult>;
  /** Additional CSS classes on the root container. */
  className?: string;
}

/** Internal state machine. */
export type TokenCreateStep = "chain" | "configure" | "preview" | "submitting" | "result";

export interface StepDescriptor {
  id: TokenCreateStep;
  label: string;
}
