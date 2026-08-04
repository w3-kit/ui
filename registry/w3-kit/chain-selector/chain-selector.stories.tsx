// CSF3-format stories for <ChainSelector />.
//
// See `types/storybook.d.ts` for the ambient types. When a consumer installs
// Storybook, this file becomes a standard CSF3 entry.

import type { Meta, StoryObj } from "@storybook/react";
import { ChainSelector } from "./chain-selector";
import { defaultChains, defaultEvmChains, defaultSolanaChains } from "./utils";

const meta: Meta<typeof ChainSelector> = {
  title: "Web3/ChainSelector",
  component: ChainSelector,
  parameters: { layout: "centered" },
  args: {
    chains: defaultChains,
  },
};

export default meta;
type Story = StoryObj<typeof ChainSelector>;

export const Default: Story = {
  name: "Default (mixed EVM + Solana)",
  args: { searchable: false },
};

export const Searchable: Story = {
  name: "Searchable",
  args: { searchable: true },
};

export const WithTestnets: Story = {
  name: "Includes testnet toggle (Solana devnet visible)",
  args: { searchable: true, showTestnetToggle: true },
};

export const EvmOnly: Story = {
  name: "EVM only (no Solana section)",
  args: { chains: defaultEvmChains },
};

export const SolanaOnly: Story = {
  name: "Solana only (no EVM section)",
  args: { chains: defaultSolanaChains },
};
