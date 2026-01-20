import { Network, Token } from './types';

// Default supported networks
export const DEFAULT_NETWORKS: Network[] = [
  {
    id: 1,
    name: "Ethereum",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040",
  },
  {
    id: 137,
    name: "Polygon",
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=040",
  },
  {
    id: 56,
    name: "BSC",
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040",
  },
  {
    id: 43114,
    name: "Avalanche",
    icon: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=040",
  },
];

// Default available tokens
export const DEFAULT_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040',
    balance: '0',
    decimals: 18
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040',
    balance: '0',
    decimals: 6
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
    balance: '0',
    decimals: 6
  }
];

// Default token fees
export const DEFAULT_TOKEN_FEES: Record<string, string> = {
  'ETH': '0.001',
  'USDC': '5',
  'USDT': '5'
};

// Animation constants
export const buttonAnimation = "transition-all duration-300 active:scale-95";
export const switchAnimation = "transition-all duration-300 ease-in-out";
export const tooltipAnimation = "transition-all duration-300";
