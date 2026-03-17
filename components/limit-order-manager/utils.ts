export function getStatusVariant(status: "active" | "executed" | "cancelled"): "success" | "default" | "error" {
  return status === "active" ? "success" : status === "executed" ? "default" : "error";
}

export function formatTimestamp(timestamp: number): string {
  const diff = (Date.now() - timestamp) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}
