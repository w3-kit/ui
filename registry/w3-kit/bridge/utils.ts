/** Format a numeric string to a fixed number of decimal places */
export function formatAmount(value: string, decimals = 6): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "";
  return num.toFixed(decimals).replace(/\.?0+$/, "");
}
