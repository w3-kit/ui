export async function fetchGasPrice(chainId: number): Promise<GasPrice> {
  // In a real implementation, you would fetch from an API like Etherscan or your own node
  // This is a mock implementation
  const baseFee = Math.floor(Math.random() * 30) + 10;
  
  return {
    low: baseFee + 1,
    medium: baseFee + 2,
    high: baseFee + 5,
    baseFee,
    lastBlock: Math.floor(Math.random() * 1000000) + 15000000
  };
}

export function estimateTransactionCost(
  gasPrice: GasPrice,
  gasLimit: number
): GasEstimate {
  return {
    gasLimit,
    estimatedCost: {
      low: formatEther(gasPrice.low * gasLimit),
      medium: formatEther(gasPrice.medium * gasLimit),
      high: formatEther(gasPrice.high * gasLimit)
    }
  };
}

export function formatGwei(value: number): string {
  return value.toFixed(0);
}

export function formatEther(value: number): string {
  return (value / 1e9).toFixed(6);
} 