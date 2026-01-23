import { GasPrice, GasEstimate } from "./types";

export async function fetchGasPrice(chainId: number): Promise<GasPrice> {
  // Simulated gas price fetch - replace with actual API call
  const baseFee = Math.floor(Math.random() * 30) + 10;
  return {
    low: baseFee + 1,
    medium: baseFee + 2,
    high: baseFee + 5,
    baseFee,
    lastBlock: Math.floor(Math.random() * 1000000) + 15000000,
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
      high: formatEther(gasPrice.high * gasLimit),
    },
  };
}

export function formatGwei(value: number): string {
  return value.toFixed(0);
}

export function formatEther(value: number): string {
  return (value / 1e9).toFixed(6);
}

export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};
