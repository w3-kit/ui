export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function formatEther(value: string): string {
  const num = Number(value) / 1e18;
  return num.toFixed(4);
}

export function getStatusBadgeVariant(
  status: string
): "default" | "success" | "warning" | "error" {
  switch (status.toLowerCase()) {
    case "pending":
      return "warning";
    case "success":
    case "confirmed":
      return "success";
    case "failed":
    case "error":
      return "error";
    default:
      return "default";
  }
}
