# @w3-kit/ui

Programmatic entry point for the w3-kit Web3 component library.

- **shadcn registry** — install components individually from `registry/w3-kit/`.
- **package** — `@w3-kit/ui` exports the same components for direct npm consumption.

## Install

```bash
npm install @w3-kit/ui
```

## Usage

```tsx
import { TokenCreate, ChainSelector, defaultChains } from "@w3-kit/ui";

export default function Page() {
  return (
    <TokenCreate
      chains={defaultChains}
      onDeploy={async ({ chain, family, data }) => {
        // Your deploy logic, e.g. via viem or @solana/spl-token.
        return { address: "0x…", txHash: "0x…" };
      }}
    />
  );
}
```

## Exports

### `<TokenCreate />`

A guided flow for deploying a new token. Renders a chain picker → ecosystem-specific form (EVM ERC-20 or Solana SPL) → transaction preview → progress → result with explorer links.

| Prop            | Type                                            | Description                                       |
| --------------- | ----------------------------------------------- | ------------------------------------------------- |
| `chains`        | `Chain[]`                                       | Pass-through to `<ChainSelector />`.              |
| `defaultChainId`| `number \| string`                              | Initial selection.                                |
| `onDeploy`      | `(req: DeployRequest) => Promise<DeployResult>` | Your deploy logic. Resolves with address + txHash. |
| `className`     | `string`                                        | Optional extra classes on the root container.     |

### `<ChainSelector />`

| Prop            | Type                              | Description                          |
| --------------- | --------------------------------- | ------------------------------------ |
| `chains`        | `Chain[]`                         | EVM and/or Solana chains.            |
| `selectedChainId`| `number \| string`               | Currently selected chain's `chainId`.|
| `onSelect`      | `(chainId: number \| string) => void` | Fired on user selection.        |
| `searchable`    | `boolean`                         | Optional search input.               |
| `showTestnetToggle` | `boolean`                      | Override the auto-detected toggle.   |

`@w3-kit/ui` also exports helper utilities:

- `defaultChains`, `defaultEvmChains`, `defaultSolanaChains`
- `explorerAddressUrl(chain, address)`, `explorerTxUrl(chain, txHash)`
- `validateEvmTokenForm`, `validateSolanaTokenForm`, `formatBaseUnits`

## Related

- The shadcn registry at `registry/w3-kit/` is the canonical distribution channel.
- Each component's contract, security notes, and educational commentary live in `components/<name>/<name>.learn.md`.
