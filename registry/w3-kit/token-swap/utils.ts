export function formatRate(rate: number, fromSymbol: string, toSymbol: string): string {
  if (rate >= 1000) return `1 ${fromSymbol} ≈ ${rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${toSymbol}`;
  if (rate >= 1) return `1 ${fromSymbol} ≈ ${rate.toFixed(4)} ${toSymbol}`;
  return `1 ${fromSymbol} ≈ ${rate.toFixed(6)} ${toSymbol}`;
}
