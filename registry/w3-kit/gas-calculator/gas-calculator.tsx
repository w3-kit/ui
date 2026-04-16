"use client";

import React from "react";
import { Fuel, Clock, Zap, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GasCalculatorProps, GasSpeed } from "./types";
import { formatUsd } from "./utils";

const speedIcons: Record<string, React.ElementType> = {
  Economy: Clock,
  Standard: Gauge,
  Fast: Zap,
};

export function GasCalculator({
  speeds,
  selectedSpeed,
  onSelect,
  ethPrice,
  className,
}: GasCalculatorProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Fuel className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Gas</h3>
      </div>

      {/* Speed cards */}
      <div className="space-y-1.5 px-4 pb-4">
        {speeds.map((speed) => {
          const isSelected = selectedSpeed === speed.name;
          const Icon = speedIcons[speed.name] ?? Fuel;

          return (
            <button
              key={speed.name}
              onClick={() => onSelect?.(speed)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                isSelected
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isSelected ? "text-white dark:text-gray-900" : "text-gray-400 dark:text-gray-500",
                )}
              />

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-white dark:text-gray-900" : "text-gray-900 dark:text-white",
                  )}
                >
                  {speed.name}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    isSelected
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {speed.time}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    isSelected ? "text-white dark:text-gray-900" : "text-gray-900 dark:text-white",
                  )}
                >
                  {speed.gwei} Gwei
                </p>
                <p
                  className={cn(
                    "text-xs tabular-nums",
                    isSelected
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {speed.cost} ETH
                  {ethPrice != null && (
                    <span className="ml-1">({formatUsd(parseFloat(speed.cost) * ethPrice)})</span>
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
