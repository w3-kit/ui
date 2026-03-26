# w3-kit

CLI tool to add Web3 components to your React project. Built on [shadcn/ui](https://ui.shadcn.com) patterns with Tailwind CSS.

## Quick Start

```bash
# Add a component
npx w3-kit@latest add nft-collection-grid

# List available components
npx w3-kit@latest list

# Search components
npx w3-kit@latest search token
```

## Components

27 production-ready Web3 components across 6 categories:

- **Token** — Token Card, Token List, Token Swap, Price Ticker, Token Vesting, Token Airdrop
- **NFT** — NFT Card, NFT Collection Grid, NFT Marketplace Aggregator
- **Wallet** — Connect Wallet, Wallet Balance, Transaction History, Address Book, Multisig Wallet
- **DeFi** — Staking Interface, Liquidity Pool Stats, DeFi Position Manager, Asset Portfolio, Flash Loan Executor, Limit Order Manager, Subscription Payments
- **Utility** — Gas Calculator, Network Switcher, ENS Resolver, Smart Contract Scanner, Contract Interaction
- **General** — Bridge

## AI Integration

Use [`@w3-kit/mcp`](https://www.npmjs.com/package/@w3-kit/mcp) to connect AI coding assistants (Claude Code, Cursor) to w3-kit. The MCP server gives your AI full knowledge of all components, props, design tokens, and guidelines.

```json
{
  "mcpServers": {
    "w3-kit": {
      "command": "npx",
      "args": ["@w3-kit/mcp"]
    }
  }
}
```

## Links

- [Documentation](https://w3-kit.com)
- [MCP Server](https://www.npmjs.com/package/@w3-kit/mcp)
- [GitHub](https://github.com/AnonimRosul/w3-kit)
