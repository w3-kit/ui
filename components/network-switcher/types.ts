import { Network } from './types';

export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  currency: string;
  blockExplorer: string;
  icon?: string;
}

export interface NetworkSwitcherProps {
  currentNetwork?: Network | null;
  onNetworkChange?: (network: Network) => void;
  className?: string;
}

export const NETWORKS: Network[] = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/your-api-key',
    blockExplorer: 'https://etherscan.io',
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040'
  },
  {
    chainId: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=040'
  },
  {
    chainId: 56,
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040'
  },
  {
    chainId: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
    logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=040'
  }
]; 