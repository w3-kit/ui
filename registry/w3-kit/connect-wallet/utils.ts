/** Truncate an address to 0x1234...5678 format */
export function truncateAddress(address: string): string {
  if (!address || address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Get a wallet option by ID from the wallets array */
export function findWallet(
  wallets: { id: string }[],
  walletId: string | undefined,
) {
  if (!walletId) return undefined;
  return wallets.find((w) => w.id === walletId);
}
