import { Network } from './types';

export const NETWORKS: Network[] = [
  {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://etherscan.io',
    icon: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp'
  },
  {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://polygonscan.com',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg'
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    currency: 'ETH',
    rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://arbiscan.io',
    icon: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg'
  },
  {
    chainId: 10,
    name: 'Optimism',
    currency: 'ETH',
    rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://optimistic.etherscan.io',
    icon: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png'
  },
  {
    chainId: 56,
    name: 'BNB Chain',
    currency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg'
  },
  {
    chainId: 43114,
    name: 'Avalanche',
    currency: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
    icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg'
  }
];

// Test networks
export const TEST_NETWORKS: Network[] = [
  {
    chainId: 5,
    name: 'Goerli',
    currency: 'ETH',
    rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://goerli.etherscan.io',
    icon: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp'
  },
  {
    chainId: 80001,
    name: 'Mumbai',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://mumbai.polygonscan.com',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg'
  },
  {
    chainId: 421613,
    name: 'Arbitrum Goerli',
    currency: 'ETH',
    rpcUrl: 'https://arb-goerli.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://goerli.arbiscan.io',
    icon: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg'
  }
]; 