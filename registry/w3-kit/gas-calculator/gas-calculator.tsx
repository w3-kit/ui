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
        color: "text-success",
        description: "Best for non-urgent transactions",
      };
    case "medium":
      return {
        label: "Standard",
        time: "< 2 mins",
        icon: Wallet,
        color: "text-primary",
        description: "Recommended for most transactions",
      };
    case "high":
      return {
        label: "Fast",
        time: "< 30 secs",
        icon: Zap,
        color: "text-info",
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
      className={`bg-card rounded-xl border border-border shadow-sm overflow-hidden ${className}`}
    >
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Gas Calculator
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Current network gas prices and estimates
            </p>
          </div>
          <button
            onClick={() => updateGasPrice()}
            disabled={loading || isRefreshing}
            className="p-2 text-muted-foreground hover:text-foreground
              rounded-lg hover:bg-accent
              transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success" />
              Low Traffic
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Normal
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-info" />
              High Priority
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
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
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-accent"
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
              className="w-full px-4 py-2 text-sm border border-border
                rounded-lg bg-card text-foreground
                focus:outline-none focus:ring-2 focus:ring-ring
                transition-all duration-200 pr-20
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Custom gas limit"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
              <span className="text-sm text-muted-foreground">
                Gas units
              </span>
              <div className="flex flex-col -space-y-1">
                <button
                  onClick={() => setGasLimit(gasLimit + 1000)}
                  className="p-0.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setGasLimit(Math.max(0, gasLimit - 1000))}
                  className="p-0.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-[200px] bg-muted rounded-xl" />
          </div>
        ) : error ? (
          <div
            className="p-4 rounded-xl bg-destructive/10
            border border-destructive/30
            flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
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
                          ? "border-foreground bg-muted"
                          : "border-border"
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
                          <div className="font-medium text-foreground">
                            {config.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {config.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-foreground">
                          {formatGwei(gasPrice[speed])}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Gwei • {config.time}
                        </div>
                      </div>
                    </div>
                    {estimate && (
                      <div
                        className="mt-3 pt-3 border-t border-border
                        text-sm text-muted-foreground text-right"
                      >
                        Estimated cost: {estimate.estimatedCost[speed]} ETH
                      </div>
                    )}
                  </button>
                );
              })}

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Base Fee: {formatGwei(gasPrice.baseFee)} Gwei
                  </span>
                  <span className="text-muted-foreground">
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
