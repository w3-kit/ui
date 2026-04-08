"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Zap, Clock, Wallet, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import { GasPrice, GasCalculatorProps } from "./types";
import { fetchGasPrice, formatGwei, formatEther } from "./utils";

export type { GasPrice, GasCalculatorProps };

type Speed = "low" | "medium" | "high";

const speeds: { key: Speed; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "low", label: "Economy", icon: Clock, desc: "5+ mins" },
  { key: "medium", label: "Standard", icon: Wallet, desc: "< 2 mins" },
  { key: "high", label: "Fast", icon: Zap, desc: "< 30 secs" },
];

const presets = [
  { label: "Transfer", gas: 21000 },
  { label: "ERC20", gas: 65000 },
  { label: "Swap", gas: 200000 },
];

export function GasCalculator({ className, onGasSelect, ethPrice }: GasCalculatorProps) {
  const [gasPrice, setGasPrice] = useState<GasPrice | null>(null);
  const [speed, setSpeed] = useState<Speed>("medium");
  const [gasLimit, setGasLimit] = useState(21000);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setGasPrice(await fetchGasPrice());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const currentPrice = gasPrice ? gasPrice[speed] : 0;
  const ethCost = (currentPrice * gasLimit) / 1e9;
  const usdCost = ethPrice ? ethCost * ethPrice : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          Gas Calculator
        </p>
        <button
          onClick={refresh}
          disabled={loading}
          aria-label="Refresh gas prices"
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Speed selector */}
        <div className="grid grid-cols-3 gap-2">
          {speeds.map((s) => {
            const isSelected = speed === s.key;
            return (
              <button
                key={s.key}
                onClick={() => {
                  setSpeed(s.key);
                  onGasSelect?.(gasLimit, gasPrice?.[s.key] ?? 0);
                }}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
                  isSelected
                    ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900"
                    : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900",
                )}
              >
                <s.icon
                  className={cn(
                    "h-4 w-4 mb-1",
                    isSelected
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-gray-500",
                  )}
                />
                <span className="text-xs font-medium text-gray-900 dark:text-white">{s.label}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{s.desc}</span>
                {loading ? (
                  <div className="h-4 w-12 mt-1 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                ) : gasPrice ? (
                  <span className="text-xs font-medium text-gray-900 dark:text-white mt-1 tabular-nums">
                    {formatGwei(gasPrice[s.key])}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Presets */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400 mb-2">
            Transaction Type
          </p>
          <div className="flex gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setGasLimit(p.gas)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
                  gasLimit === p.gas
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estimate */}
        {gasPrice && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
            <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
              Estimated Cost
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-lg font-semibold text-gray-900 dark:text-white tabular-nums">
                {formatEther(currentPrice, gasLimit)} ETH
              </p>
              {usdCost !== null && (
                <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                  ≈ ${usdCost < 0.01 ? "<0.01" : usdCost.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums">
              {formatGwei(currentPrice)} · {gasLimit.toLocaleString()} gas · base{" "}
              {formatGwei(gasPrice.baseFee)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GasCalculator;
