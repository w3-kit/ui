import { RiskLevel } from "./types";

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case RiskLevel.LOW:
      return "text-green-400";
    case RiskLevel.MEDIUM:
      return "text-yellow-400";
    case RiskLevel.HIGH:
      return "text-orange-400";
    case RiskLevel.CRITICAL:
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case RiskLevel.LOW:
      return "bg-green-400/20";
    case RiskLevel.MEDIUM:
      return "bg-yellow-400/20";
    case RiskLevel.HIGH:
      return "bg-orange-400/20";
    case RiskLevel.CRITICAL:
      return "bg-red-400/20";
    default:
      return "bg-gray-400/20";
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
