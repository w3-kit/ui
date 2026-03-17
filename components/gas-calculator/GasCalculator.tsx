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

export function GasCalculator({ className, onGasSelect }: GasCalculatorProps) {
  const [gasPrice, setGasPrice] = useState<GasPrice | null>(null);
  const [speed, setSpeed] = useState<Speed>("medium");
  const [gasLimit, setGasLimit] = useState(21000);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setGasPrice(await fetchGasPrice()); } finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const currentPrice = gasPrice ? gasPrice[speed] : 0;

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Gas Calculator</h3>
        <button onClick={refresh} disabled={loading} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Speed selector */}
        <div className="grid grid-cols-3 gap-2">
          {speeds.map((s) => (
            <button
              key={s.key}
              onClick={() => { setSpeed(s.key); onGasSelect?.(gasLimit, gasPrice?.[s.key] ?? 0); }}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg border text-center transition-colors duration-150",
                speed === s.key
                  ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900"
                  : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
            >
              <s.icon className="h-4 w-4 text-gray-500 dark:text-gray-400 mb-1" />
              <span className="text-xs font-medium text-gray-900 dark:text-white">{s.label}</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{s.desc}</span>
              {gasPrice && <span className="text-xs font-medium text-gray-900 dark:text-white mt-1">{formatGwei(gasPrice[s.key])}</span>}
            </button>
          ))}
        </div>

        {/* Presets */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Transaction Type</p>
          <div className="flex gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setGasLimit(p.gas)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150",
                  gasLimit === p.gas
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
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
            <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Cost</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {formatEther(currentPrice, gasLimit)} ETH
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formatGwei(currentPrice)} · {gasLimit.toLocaleString()} gas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GasCalculator;
