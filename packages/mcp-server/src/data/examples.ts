interface ComponentExample {
  basic: string;
  full: string;
}

export const EXAMPLES: Record<string, ComponentExample> = {
  "token-card": {
    basic: `import { TokenCard } from '@/components/token-card';

<TokenCard
  token={{
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 1,
  }}
/>`,
    full: `import { TokenCard } from '@/components/token-card';

<TokenCard
  token={{
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 1,
    price: 1.0,
    balance: '1500.00',
    value: 1500.0,
    priceChange24h: 0.01,
    verified: true,
    marketCap: 32000000000,
    volume24h: 5200000000,
    rank: 7,
  }}
  showBalance={true}
  showPrice={true}
  showPriceChange={true}
  onClick={(token) => console.log('Selected:', token.symbol)}
  onFavoriteToggle={(token, isFavorite) => console.log(token.symbol, isFavorite)}
/>`,
  },
  "price-ticker": {
    basic: `import { PriceTicker } from '@/components/price-ticker';

<PriceTicker symbol="ETH" />`,
    full: `import { PriceTicker } from '@/components/price-ticker';

<PriceTicker
  symbol="ETH"
  refreshInterval={30000}
  showVolume={true}
  showMarketCap={true}
/>`,
  },
  "wallet-balance": {
    basic: `import { WalletBalance } from '@/components/wallet-balance';

<WalletBalance address="0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18" />`,
    full: `import { WalletBalance } from '@/components/wallet-balance';

<WalletBalance
  address="0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
  showPortfolioSummary={true}
  networks={[1, 137, 42161]}
/>`,
  },
  "gas-calculator": {
    basic: `import { GasCalculator } from '@/components/gas-calculator';

<GasCalculator />`,
    full: `import { GasCalculator } from '@/components/gas-calculator';

<GasCalculator
  chainId={1}
  refreshInterval={15000}
  onGasSelect={(gas, price) => console.log('Gas:', gas, 'Price:', price)}
/>`,
  },
  "token-swap": {
    basic: `import { TokenSwap } from '@/components/token-swap';

<TokenSwap />`,
    full: `import { TokenSwap } from '@/components/token-swap';

<TokenSwap
  defaultFromToken="ETH"
  defaultToToken="USDC"
  slippageTolerance={0.5}
  onSwapComplete={(tx) => console.log('Swap tx:', tx)}
/>`,
  },
  "connect-wallet": {
    basic: `import { ConnectWallet } from '@/components/connect-wallet';

<ConnectWallet />`,
    full: `import { ConnectWallet } from '@/components/connect-wallet';

<ConnectWallet
  onConnect={(address) => console.log('Connected:', address)}
  onDisconnect={() => console.log('Disconnected')}
  supportedWallets={['metamask', 'walletconnect', 'coinbase']}
/>`,
  },
  "staking-interface": {
    basic: `import { StakingInterface } from '@/components/staking-interface';

<StakingInterface
  pools={[{
    id: '1',
    name: 'ETH Staking',
    token: { symbol: 'ETH', logoURI: '/eth.svg', decimals: 18 },
    apr: 4.5,
    minStake: '0.1',
    lockPeriod: 30,
    totalStaked: '150000',
  }]}
/>`,
    full: `import { StakingInterface } from '@/components/staking-interface';

<StakingInterface
  pools={[
    {
      id: '1',
      name: 'ETH Staking',
      token: { symbol: 'ETH', logoURI: '/eth.svg', decimals: 18 },
      apr: 4.5,
      minStake: '0.1',
      lockPeriod: 30,
      totalStaked: '150000',
    },
    {
      id: '2',
      name: 'MATIC Staking',
      token: { symbol: 'MATIC', logoURI: '/matic.svg', decimals: 18 },
      apr: 8.2,
      minStake: '100',
      lockPeriod: 14,
      totalStaked: '5000000',
    },
  ]}
  userBalance="2.5"
  onStake={(poolId, amount) => console.log('Stake:', poolId, amount)}
  onUnstake={(poolId, amount) => console.log('Unstake:', poolId, amount)}
/>`,
  },
};

export function getExample(name: string): ComponentExample | undefined {
  return EXAMPLES[name];
}
