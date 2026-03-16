import { RiskLevel } from "./types";

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case RiskLevel.LOW:
      return "text-success";
    case RiskLevel.MEDIUM:
      return "text-warning";
    case RiskLevel.HIGH:
      return "text-warning";
    case RiskLevel.CRITICAL:
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case RiskLevel.LOW:
      return "bg-success/20";
    case RiskLevel.MEDIUM:
      return "bg-warning/20";
    case RiskLevel.HIGH:
      return "bg-warning/20";
    case RiskLevel.CRITICAL:
      return "bg-destructive/20";
    default:
      return "bg-muted";
  }
}

export function formatPrice(price: number, currency: string): string {
  return `${price.toFixed(3)} ${currency}`;
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
