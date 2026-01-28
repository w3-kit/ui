export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getChainName(chainId: number): string {
  switch (chainId) {
    case 1:
      return "Ethereum";
    case 137:
      return "Polygon";
    case 56:
      return "BSC";
    case 43114:
      return "Avalanche";
    case 42161:
      return "Arbitrum";
    case 10:
      return "Optimism";
    default:
      return "Unknown Chain";
  }
}

export function getExplorerUrl(chainId: number, address: string): string {
  switch (chainId) {
    case 1:
      return `https://etherscan.io/address/${address}`;
    case 137:
      return `https://polygonscan.com/address/${address}`;
    case 56:
      return `https://bscscan.com/address/${address}`;
    case 43114:
      return `https://snowtrace.io/address/${address}`;
    case 42161:
      return `https://arbiscan.io/address/${address}`;
    case 10:
      return `https://optimistic.etherscan.io/address/${address}`;
    default:
      return "#";
  }
}
