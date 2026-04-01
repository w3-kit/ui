# Token Swap — Learn

## What is a token swap?

A token swap exchanges one cryptocurrency for another directly on a blockchain — no bank, no exchange account, no intermediary. You connect your wallet, pick two tokens, and the swap happens in a single transaction.

On traditional exchanges (Coinbase, Binance), you deposit funds, place an order, wait for a match, then withdraw. With on-chain swaps, your tokens never leave your wallet until the exact moment they're exchanged.

## How does it work under the hood?

### Automated Market Makers (AMMs)

Most on-chain swaps use an **AMM** instead of a traditional order book. Here's the key idea:

1. **Liquidity providers** deposit pairs of tokens into a **pool** (e.g., ETH + USDC)
2. A mathematical formula (usually `x * y = k`) determines the price based on the ratio of tokens in the pool
3. When you swap, you add tokens to one side of the pool and remove from the other — this changes the ratio, which changes the price

This is fundamentally different from order books where buyers and sellers set specific prices. With AMMs, the price is algorithmic.

### EVM vs Solana

| | EVM (Uniswap, SushiSwap) | Solana (Jupiter, Raydium) |
|---|---|---|
| **Standard** | ERC-20 token approvals | SPL token accounts |
| **Before swapping** | Must `approve()` the router to spend your tokens | Token accounts created automatically |
| **Gas cost** | $2-50 on mainnet, <$0.01 on L2s | <$0.01 always |
| **Speed** | 12s (Ethereum), 2s (L2s) | ~400ms |
| **Aggregators** | 1inch, Paraswap | Jupiter |

### Key terms

- **Slippage** — The difference between the expected price and the actual execution price. Pools with low liquidity have higher slippage. Setting slippage tolerance too low = transaction fails. Too high = you might get a bad price.
- **Price impact** — How much YOUR trade moves the price. Big trades in small pools = big price impact.
- **Liquidity** — The total value of tokens in the pool. More liquidity = less slippage = better prices.
- **Router** — The smart contract that finds the best path for your swap (might route through multiple pools).

## Security considerations

- **Always check the token address** — scam tokens can have the same name/symbol as real ones
- **Set reasonable slippage** — 0.5-1% for major tokens, up to 5% for low-liquidity tokens
- **Beware of sandwich attacks** — MEV bots can front-run your swap on EVM chains. Private RPCs (Flashbots) or L2s reduce this risk
- **Infinite approvals** — Many dApps request unlimited token approval. This means the contract can spend all your tokens forever. Revoke unused approvals at revoke.cash

## How this component works

This component provides the UI for a token swap interface. It handles:
- Token selection (input/output)
- Amount input with balance display
- Slippage settings
- Swap direction toggle (flip input/output)
- Loading and transaction states

The component is **presentation-only** — it doesn't execute actual swaps. You connect it to your swap logic (Uniswap SDK, Jupiter SDK, etc.) via the callback props.
