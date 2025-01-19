export function formatBalance(balance?: string, decimals = 18): string {
  if (!balance) return '0';
  const num = Number(balance) / Math.pow(10, decimals);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
} 