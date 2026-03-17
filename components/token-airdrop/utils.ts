import { AirdropInfo, AirdropStatus } from "./types";

export function getAirdropStatus(airdrop: AirdropInfo): AirdropStatus {
  const now = Date.now();
  if (airdrop.claimed) return "claimed";
  if (now < airdrop.startTime) return "upcoming";
  if (now > airdrop.endTime) return "expired";
  return "active";
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function getStatusVariant(status: AirdropStatus): "success" | "default" | "warning" | "error" {
  return status === "active" ? "success" : status === "claimed" ? "default" : status === "upcoming" ? "warning" : "error";
}
