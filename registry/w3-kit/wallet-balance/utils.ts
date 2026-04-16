import type { Token } from "./types";

/** Calculate the USD value of a token holding */
export function tokenValue(token: Token): number {
  return parseFloat(token.balance) * (token.price || 0);
}

/** Calculate total portfolio value */
export function totalPortfolioValue(tokens: Token[]): number {
  return tokens.reduce((sum, t) => sum + tokenValue(t), 0);
}

/** Calculate weighted 24h change across all tokens */
export function weightedChange24h(tokens: Token[]): number {
  const total = totalPortfolioValue(tokens);
  if (total === 0) return 0;

  return tokens.reduce((sum, t) => {
    const weight = tokenValue(t) / total;
    return sum + weight * (t.priceChange24h ?? 0);
  }, 0);
}

/** Format a number as USD currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format a balance string to a readable number */
export function formatBalance(balance: string, maxDecimals = 4): string {
  const num = parseFloat(balance);
  if (isNaN(num)) return "0";
  if (num === 0) return "0";
  if (num < 0.0001) return "<0.0001";
  return num.toLocaleString("en-US", { maximumFractionDigits: maxDecimals });
}

/** Deterministic colors for allocation bar when token.color is not set */
const PALETTE = [
  "#627EEA", "#2775CA", "#F7931A", "#8247E5", "#28A0F0",
  "#FF0420", "#0052FF", "#E84142", "#2A5ADA", "#14F195",
];

export function getAllocationColor(index: number, token: Token): string {
  return token.color ?? PALETTE[index % PALETTE.length];
}

/** Sort tokens by value descending */
export function sortByValue(tokens: Token[]): Token[] {
  return [...tokens].sort((a, b) => tokenValue(b) - tokenValue(a));
}
