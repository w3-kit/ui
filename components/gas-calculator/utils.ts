import { GasPrice } from "./types";

export async function fetchGasPrice(): Promise<GasPrice> {
  const baseFee = Math.floor(Math.random() * 30) + 10;
  return { low: baseFee + 1, medium: baseFee + 2, high: baseFee + 5, baseFee };
}

export function formatGwei(value: number): string {
  return `${value.toFixed(0)} Gwei`;
}

export function formatEther(gweiPrice: number, gasLimit: number): string {
  return ((gweiPrice * gasLimit) / 1e9).toFixed(6);
}
