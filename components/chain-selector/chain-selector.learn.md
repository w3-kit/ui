# Chain Selector — Learn

## What is a chain?

"Chain" is shorthand for *blockchain network*. Every wallet, transaction, token, and contract lives on exactly one chain at a time. When you switch chains in a wallet app, the *same address* becomes a *different account* on the new network with its own balance and history.

A chain isn't just a cryptocurrency — it's a whole state machine with its own rules. Ethereum, Polygon, and Arbitrum all run the EVM (Ethereum Virtual Machine), so they share tooling, but their consensus rules, gas markets, and block confirmations differ. Solana is a separate VM family; an Ethereum-style contract won't run there.

## Why a chain selector exists in dApps

Most tokenized actions — swaps, mints, transfers — are chain-specific. Before TokenCreate can deploy an ERC-20, it needs to know *which* EVM chain you're deploying to. Before it can mint an SPL token, it needs to know which Solana cluster (mainnet, devnet). A single UI component that fans out into multiple downstream paths needs an upfront choice point.

This component is that choice point.

## How this component works

`<ChainSelector />` is presentational — it doesn't talk to a wallet or any chain RPC. It receives a list of `Chain` objects and emits the selected one's `chainId` via `onSelect`. Consumers (TokenCreate, the transaction history, etc.) read the chosen chain's `ecosystem` field to route the user into the right sub-flow.

### Grouping

Chains are split into **EVM** and **Solana** groups based on the `ecosystem` field. Within each group, the rows are sorted as-given. This grouping exists because downstream code uses `chain.ecosystem === "evm"` to switch form rendering.

### Search

When `searchable` is set, the list filters across `name`, `symbol`, `currency`, and `chainId`. Solana clusters and EVM chain IDs both stringify cleanly, so typing `137` finds Polygon, `8453` finds Base, and `mainnet` finds Solana mainnet.

### Testnet toggle

Some chains have `testnet: true`. The toggle is shown when *any* chain in the list is a testnet. Off by default — most users want mainnet, and toggling off a testnet should never accidentally hide the chain forever.

### Accessibility

The list is a `role="radiogroup"` (one chain selection at a time) with each row a `button` that sets `aria-pressed`. The `aria-labelledby` references on each group let a screen reader user hear "EVM section" and "Solana section".

## What the consumer has to do

`<ChainSelector />` only emits `chainId`. It is the consumer's job to:

1. Look up the matching `Chain` object in the array passed in.
2. Read `chain.ecosystem` and route accordingly.
3. Read `chain.explorerHost` (if any) to build post-deploy links.
4. Read `chain.testnet` to warn the user or skip explorer links on test networks.

This component is intentionally dumb about RPCs so it can be used in marketing pages (no wallet connected) as well as inside live dApps.

## Security considerations

A real dApp should *never* trust a chain selector's output alone — the user could have a stale wallet state. Treat the selector as intent ("the user wants chain 8453") and verify on submission ("the wallet is currently connected to chain 8453"). If there's a mismatch, prompt a chain switch rather than silently re-routing.
