export function vestingPercent(vested: string, total: string): number {
  const v = parseFloat(vested) || 0;
  const t = parseFloat(total) || 1;
  return Math.min(Math.round((v / t) * 100), 100);
}
