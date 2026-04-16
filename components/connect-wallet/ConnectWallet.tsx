"use client";

/**
 * ConnectWallet — Pure UI wallet picker component.
 *
 * This is the simplified components/ version that re-exports the registry
 * implementation. For the full source, see registry/w3-kit/connect-wallet/.
 */
export { ConnectWallet, default } from "../../registry/w3-kit/connect-wallet/connect-wallet";
export type {
  ConnectWalletProps,
  WalletOption,
  ConnectedAccount,
  Chain,
} from "../../registry/w3-kit/connect-wallet/types";
