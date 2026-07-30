# Token Create — Learn

## What does "creating a token" mean?

A "token" is just an entry on a blockchain ledger that says *address X owns N units of asset T*. The contract (or program) that owns that entry defines the rules — how many decimals, whether new supply can be minted, whether holders can burn their tokens, who has authority to do those things.

On EVM chains, the dominant standard is **ERC-20**, defined by Ethereum's EIP-20 proposal in 2015. It specifies a contract interface with `name`, `symbol`, `decimals`, `totalSupply`, `balanceOf`, `transfer`, `transferFrom`, and `approve`. Anything that implements that interface — including tokens with optional extensions like `mint` or `burn` — is "an ERC-20".

On Solana, the equivalent is the **SPL Token** program, written by Solana Labs in 2019. It uses a different model: a *mint* account owns the metadata (supply, decimals, authorities), and each holder gets a *token account*. SPL supports the same conceptual features as ERC-20 — fixed supply, mint authority, freeze authority — but the on-chain shape is different.

## What this component does

`<TokenCreate />` is a guided flow for issuing a new token. It doesn't talk to a wallet or chain RPC — that's the consumer's job. Instead, it:

1. Lets the user pick a chain (Ethereum, Polygon, Base, etc. *or* Solana)
2. Renders ecosystem-appropriate form fields
3. Previews the deploy parameters
4. Calls `onDeploy(req)` and shows progress
5. Surfaces the deployed token address with copy + explorer links

The component never holds a private key and never signs a transaction. It's a UI scaffold.

### EVM path

```
name         → string,   e.g. "My Token"
symbol       → string,   e.g. "MTK"
decimals     → 0-18,     18 = standard; stablecoins usually use 6
initialSupply → string,  whole-token amount (component scales by decimals)
mintable     → boolean   enables _mint(address, amount) for the deployer
burnable     → boolean   enables burn(address, amount) for any holder
```

### Solana path

```
name           → string
symbol         → string
decimals       → 0-9,    9 = standard; most tokens use 6 or 9
initialSupply  → string
mintAuthority  → "self" | "renounced"
```

"Renouncing" mint authority is Solana's equivalent of "burn the keys" — it's a one-way switch that makes supply permanently fixed. There's no per-holder burn operation in SPL; instead, supply destruction happens by sending tokens to a known dead address.

## The state machine

The component has 5 internal states; the visible stepper collapses them into 4:

```
chain → configure → preview → submitting → result
                       ↑              ↓
                       └─── error ────┘
```

- **chain** — user picks a target chain
- **configure** — form fields, validated on `Preview`
- **preview** — read-only summary of the deploy parameters
- **submitting** — calls `onDeploy`, shows spinner
- **result** — token address with copy + explorer links

If `onDeploy` rejects, the component returns to **preview** with an error banner. The form state is preserved — the user can fix and re-submit without re-entering everything.

## Why `onDeploy` is a callback

There are many ways to actually deploy a token. ERC-20 alone has flavors:

- **OpenZeppelin** — the de-facto template. Industry standard.
- **Solmate** — gas-optimized, fewer features.
- **Custom Solidity** — your own audit, your own extensions.
- **Foundry/Hardhat scripts** — same OZ code, scripted deploy.

SPL is similarly fragmented: `@solana/spl-token`'s `createMint`, Metaplex's token-standard, the experimental Token-2022 program (Token Extensions).

A library can't know which the consumer wants. So `onDeploy` accepts the form data and lets the consumer do whatever they do. The component handles all the UX — the part that's actually reusable across stacks.

## Acceptance criteria checklist (per the issue)

- [x] Exported from `@w3-kit/ui` — see `packages/w3-kit/src/index.ts`
- [x] Uses `<ChainSelector />` and ERC-20 / SPL templates via `onDeploy`
- [x] Preview, submit, result, explorer link UI all rendered
- [x] shadcn/Tailwind styling matches other registry components
- [x] `.learn.md` present (this file)
- [x] Accessible: `radiogroup`, `aria-pressed`, `role="status"` for progress, copy/explorer links have `aria-label`s, field errors surface via `role="alert"`

## Security considerations

A real implementation MUST:

1. Verify the connected wallet is on the *exact* chain the user picked in the UI. Race conditions between chain switches and submission are real.
2. For ERC-20 with `mintable: true`, deploy behind an Ownable constructor and explicitly revoke the deployer's ownership if you want the contract to be controlled by a multisig/timelock.
3. For Solana with `mintAuthority: "renounced"`, treat the renounce call as irreversible — there's no recovery from a renounced mint authority.
4. Never log `initialSupply`, `decimals`, or `address` values to analytics in cleartext — these are mildly linkable to deployer identity if crossed with the tx hash.
5. Use `navigator.clipboard.writeText` defensively (the component does) — Safari's clipboard API silently rejects without user-gesture context.
