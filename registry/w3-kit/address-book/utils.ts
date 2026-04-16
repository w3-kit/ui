/** Truncate an address to 0x1234...5678 format */
export function truncateAddress(address: string): string {
  if (!address || address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Validate an Ethereum address or ENS name */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address) || address.toLowerCase().endsWith(".eth");
}
