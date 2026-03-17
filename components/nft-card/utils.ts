export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getChainName(chainId: number): string {
  switch (chainId) {
    case 1: return "Ethereum";
    case 137: return "Polygon";
    case 56: return "BSC";
    case 43114: return "Avalanche";
    case 42161: return "Arbitrum";
    case 10: return "Optimism";
    default: return "Unknown";
  }
}
