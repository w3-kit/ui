// CSF3-format stories for <TokenCreate />.
//
// To use: install Storybook (`npx storybook@latest init`) with the
// `@storybook/react` framework and add this file to its stories glob. The
// ambient module declarations below let these stories typecheck in this repo
// without requiring `@storybook/react` to be a dependency here.

import type { Meta, StoryObj } from "@storybook/react";
import { TokenCreate } from "./token-create";
import { defaultChains, defaultEvmChains, defaultSolanaChains } from "../chain-selector/utils";
import type { DeployRequest, DeployResult } from "./types";

// Stable mock addresses — clearly fake.
const MOCK_EVM_ADDRESS = "0xMockContractAddress000000000000000000aA1";
const MOCK_EVM_TXHASH = "0xMockTxHash0000000000000000000000000000aA1";
const MOCK_SOL_ADDRESS = "MintMock1111111111111111111111111111111111";
const MOCK_SOL_TXHASH = "5MockTxSig111111111111111111111111111111111111111";

/** Mocked deployer: resolves after ~600ms with a fake result. */
function mockDeployer(req: DeployRequest): Promise<DeployResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Toggleable error: if `name` ends with "FAIL", reject.
      if (req.data.name.endsWith("FAIL")) {
        reject(new Error("Mocked RPC error: insufficient funds for gas."));
        return;
      }
      if (req.family === "evm") {
        resolve({ address: MOCK_EVM_ADDRESS, txHash: MOCK_EVM_TXHASH });
      } else {
        resolve({ address: MOCK_SOL_ADDRESS, txHash: MOCK_SOL_TXHASH });
      }
    }, 600);
  });
}

const meta: Meta<typeof TokenCreate> = {
  title: "Web3/TokenCreate",
  component: TokenCreate,
  parameters: { layout: "centered" },
  args: {
    chains: defaultChains,
    onDeploy: mockDeployer,
  },
};

export default meta;
type Story = StoryObj<typeof TokenCreate>;

export const Default: Story = {
  name: "Default (mixed EVM + Solana)",
  args: { chains: defaultChains },
};

export const EVMOnly: Story = {
  name: "EVM only — chains list restricted to ERC-20 ecosystem",
  args: { chains: defaultEvmChains, defaultChainId: 8453 },
};

export const SolanaOnly: Story = {
  name: "Solana only — mint authority toggle visible",
  args: { chains: defaultSolanaChains, defaultChainId: "mainnet-beta" },
};

export const FailurePath: Story = {
  name: "Failure path — name 'FAIL' triggers mock error",
  args: { chains: defaultEvmChains, defaultChainId: 1 },
  // The story itself doesn't pre-fill; consumers run the flow manually.
};
