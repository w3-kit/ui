"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Zap,
  Clock,
  Wallet,
  RefreshCw,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { GasCalculatorProps, GasPrice, GasEstimate } from "./types";
import { fetchGasPrice, estimateTransactionCost, formatGwei } from "./utils";

const gasPresets = {
  Transfer: {
    value: 21000,
    description: "Send ETH to another address",
  },
  ERC20: {
    value: 65000,
    description: "Send tokens like USDT, USDC",
  },
  Swap: {
    value: 200000,
    description: "Exchange tokens on DEX",
  },
} as const;

type SpeedType = "low" | "medium" | "high";

function getSpeedConfig(speed: SpeedType) {
  switch (speed) {
    case "low":
      return {
        label: "Economy",
        time: "5+ mins",
        icon: Clock,
        color: "text-green-500",
        description: "Best for non-urgent transactions",
      };
    case "medium":
      return {
        label: "Standard",
        time: "< 2 mins",
        icon: Wallet,
        color: "text-blue-500",
        description: "Recommended for most transactions",
      };
    case "high":
      return {
        label: "Fast",
        time: "< 30 secs",
        icon: Zap,
        color: "text-purple-500",
        description: "Priority transactions",
      };
  }
}

export function GasCalculator({
  className = "",
  onGasSelect,
  refreshInterval = 15000,
  chainId = 1,
}: GasCalculatorProps) {
  const [gasPrice, setGasPrice] = useState<GasPrice | null>(null);
  const [gasLimit, setGasLimit] = useState<number>(21000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedType>("medium");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPreset, setSelectedPreset] =
    useState<keyof typeof gasPresets>("Transfer");

  const updateGasPrice = useCallback(
    async (showRefreshAnimation = true) => {
      if (showRefreshAnimation) {
        setIsRefreshing(true);
      }

      try {
        const price = await fetchGasPrice(chainId);
        setGasPrice(price);
        setError(null);
      } catch (err) {
        setError("Failed to fetch gas prices");
        console.error("Gas price fetch error:", err);
      } finally {
        setLoading(false);
        if (showRefreshAnimation) {
          setTimeout(() => setIsRefreshing(false), 1000);
        }
      }
    },
    [chainId]
  );

  useEffect(() => {
    updateGasPrice(false);
    const interval = setInterval(() => updateGasPrice(false), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, updateGasPrice]);

  const estimate: GasEstimate | null = gasPrice
    ? estimateTransactionCost(gasPrice, gasLimit)
    : null;

  const handleSpeedSelect = (speed: SpeedType) => {
    setSelectedSpeed(speed);
    if (gasPrice) {
      const price = gasPrice[speed];
      onGasSelect?.(gasLimit, price);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200
      dark:border-gray-700 shadow-sm overflow-hidden ${className}`}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Gas Calculator
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current network gas prices and estimates
            </p>
          </div>
          <button
            onClick={() => updateGasPrice()}
            disabled={loading || isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400
              dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
              transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Low Traffic
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Normal
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              High Priority
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Transaction Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.entries(gasPresets).map(([name, { value, description }]) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedPreset(name as keyof typeof gasPresets);
                  setGasLimit(value);
                }}
                className={`p-3 text-left rounded-lg transition-all duration-200 group
                  ${
                    selectedPreset === name
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <div className="font-medium">{name}</div>
                <div className="text-xs mt-1 opacity-80">{description}</div>
                <div className="text-xs mt-1 opacity-60">
                  Gas: {value.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="number"
              value={gasLimit}
              onChange={(e) => {
                setGasLimit(Number(e.target.value));
                setSelectedPreset("" as keyof typeof gasPresets);
              }}
              className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700
                rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                transition-all duration-200 pr-20
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Custom gas limit"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Gas units
              </span>
              <div className="flex flex-col -space-y-1">
                <button
                  onClick={() => setGasLimit(gasLimit + 1000)}
                  className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setGasLimit(Math.max(0, gasLimit - 1000))}
                  className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-[200px] bg-gray-100 dark:bg-gray-700 rounded-xl" />
          </div>
        ) : error ? (
          <div
            className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30
            border border-red-100 dark:border-red-800
            flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          gasPrice && (
            <div className="space-y-4">
              {(["low", "medium", "high"] as const).map((speed) => {
                const config = getSpeedConfig(speed);
                const Icon = config.icon;
                return (
                  <button
                    key={speed}
                    onClick={() => handleSpeedSelect(speed)}
                    className={`w-full p-4 rounded-xl border transition-all duration-200
                      hover:shadow-md group
                      ${
                        selectedSpeed === speed
                          ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800"
                          : "border-gray-200 dark:border-gray-700"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`${config.color} transition-transform duration-200
                          group-hover:scale-110`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {config.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {config.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatGwei(gasPrice[speed])}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Gwei • {config.time}
                        </div>
                      </div>
                    </div>
                    {estimate && (
                      <div
                        className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700
                        text-sm text-gray-500 dark:text-gray-400 text-right"
                      >
                        Estimated cost: {estimate.estimatedCost[speed]} ETH
                      </div>
                    )}
                  </button>
                );
              })}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Base Fee: {formatGwei(gasPrice.baseFee)} Gwei
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Block #{gasPrice.lastBlock}
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default GasCalculator;
