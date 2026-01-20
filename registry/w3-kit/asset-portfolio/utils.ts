// Animation constants
export const cardAnimation = "transition-all duration-300 ease-in-out";
export const itemAnimation = "animate-in fade-in-50 duration-300";

// Currency formatting
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Percentage formatting
export const formatPercent = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Get chain name from chain ID
export const getChainName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 137:
      return 'Polygon';
    case 10:
      return 'Optimism';
    case 42161:
      return 'Arbitrum One';
    case 8453:
      return 'Base';
    default:
      return `Chain ID: ${chainId}`;
  }
};

// Get block explorer URL for a token
export const getExplorerUrl = (address: string, chainId: number = 1): string => {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/token/${address}`;
    case 137:
      return `https://polygonscan.com/token/${address}`;
    case 10:
      return `https://optimistic.etherscan.io/token/${address}`;
    case 42161:
      return `https://arbiscan.io/token/${address}`;
    case 8453:
      return `https://basescan.org/token/${address}`;
    default:
      return `https://etherscan.io/token/${address}`;
  }
};
