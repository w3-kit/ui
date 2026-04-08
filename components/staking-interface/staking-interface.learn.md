# Staking Interface — Learn

## What is staking?

Staking means locking up your tokens to earn rewards. There are two very different kinds:

### 1. Protocol staking (securing the network)

On proof-of-stake chains, validators lock tokens as collateral to validate transactions. If they cheat, their stake gets "slashed" (partially destroyed). In return, they earn block rewards.

- **Ethereum:** Stake 32 ETH to run a validator (~3-4% APR), or use liquid staking (Lido, Rocket Pool) for any amount
- **Solana:** Delegate SOL to a validator (~7% APR), minimum amount is ~0.01 SOL

### 2. DeFi staking (earning yield)

Protocols incentivize users to lock tokens by distributing rewards. This could mean:

- **Liquidity mining** — stake LP tokens to earn protocol tokens
- **Single-sided staking** — lock a token to earn more of it
- **Governance staking** — lock tokens to gain voting power + rewards

## Key concepts

- **APR vs APY** — APR is the simple interest rate. APY includes compounding. A 10% APR compounded daily ≈ 10.52% APY. Be skeptical of extremely high APYs — they're often unsustainable or denominated in inflationary tokens.
- **Lock-up period** — How long your tokens are locked. Some staking has no lock-up (withdraw anytime), others require days or weeks to unstake. Ethereum validators face a withdrawal queue.
- **Slashing** — The penalty for validator misbehavior (double-signing, extended downtime). Delegators can also lose a portion of their stake if their validator is slashed.
- **Liquid staking** — Stake tokens and receive a receipt token (stETH, mSOL, jitoSOL) that you can use in DeFi while your original tokens are staked. Best of both worlds.
- **Impermanent loss** — When staking LP tokens, the value of your position can decrease relative to just holding the tokens. This happens when the price ratio of the two tokens changes.

### EVM vs Solana

|                           | EVM                                | Solana                                  |
| ------------------------- | ---------------------------------- | --------------------------------------- |
| **Protocol staking**      | 32 ETH minimum (or liquid staking) | Delegate to any validator, tiny minimum |
| **Unstaking time**        | Days to weeks (withdrawal queue)   | ~2 days (epoch boundary)                |
| **Liquid staking tokens** | stETH (Lido), rETH (Rocket Pool)   | mSOL (Marinade), jitoSOL (Jito)         |
| **DeFi staking**          | Approve + stake in separate txns   | Often single transaction                |

## Security considerations

- **Smart contract risk** — Your staked tokens are held by a contract. If the contract has a bug, funds can be lost. Prefer audited, battle-tested protocols.
- **Rug pull risk** — High APY "staking" platforms may be scams. If rewards seem too good to be true, they are.
- **Validator selection** — When delegating, research validators. Check uptime, commission rate, and slashing history.
- **Token inflation** — Staking rewards often come from token inflation. 20% APY means nothing if the token price drops 50% from dilution.

## How this component works

This component provides the UI for a staking interface. It handles:

- Stake/unstake amount input
- Available balance display
- Current staking position and earned rewards
- APR/APY display
- Claim rewards action
- Lock-up period information

The component is **presentation-only**. Connect it to your staking contract interactions via callback props.
