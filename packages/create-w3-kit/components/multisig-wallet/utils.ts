export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEther(value: string): string {
  return (Number(value) / 1e18).toFixed(4);
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
