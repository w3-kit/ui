export function formatBalance(balance?: string, decimals = 18): string {
  if (!balance) return '0';
  // Return the balance as is, without decimal conversion
  return balance;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
} 