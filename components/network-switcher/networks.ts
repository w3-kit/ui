import { Network } from './types';

export const NETWORKS: Network[] = [
    {
      chainId: 1,
      name: 'Ethereum Mainnet',
      symbol: 'ETH',
      currency: 'ETH',
      rpcUrl: 'https://mainnet.infura.io/v3/your-api-key',
      blockExplorer: 'https://etherscan.io',
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040'
    },
    {
      chainId: 137,
      name: 'Polygon',
      symbol: 'MATIC',
      currency: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      blockExplorer: 'https://polygonscan.com',
      logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=040'
    },
    {
      chainId: 56,
      name: 'BNB Smart Chain',
      symbol: 'BNB',
      currency: 'BNB',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      blockExplorer: 'https://bscscan.com',
      logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040'
    },
    {
      chainId: 43114,
      name: 'Avalanche',
      symbol: 'AVAX',
      currency: 'AVAX',
      rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
      blockExplorer: 'https://snowtrace.io',
      logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=040'
    }
  ]; 

// Test networks
export const TEST_NETWORKS: Network[] = [
  {
    chainId: 5,
    name: 'Goerli',
    symbol: 'ETH',
    currency: 'ETH',
    rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://goerli.etherscan.io',
    logoURI: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp'
  },
  {
    chainId: 80001,
    name: 'Mumbai',
    symbol: 'MATIC',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://mumbai.polygonscan.com',
    logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.svg'
  },
  {
    chainId: 421613,
    name: 'Arbitrum Goerli',
    symbol: 'ETH',
    currency: 'ETH',
    rpcUrl: 'https://arb-goerli.g.alchemy.com/v2/your-api-key',
    blockExplorer: 'https://goerli.arbiscan.io',
    logoURI: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg'
  }
]; 