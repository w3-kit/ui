"use client";

import React from "react";
import {
  Fuel,
  Clock,
  Zap,
  Gauge,
  ArrowLeftRight,
  Image as ImageIcon,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GasCalculatorProps, GasTxType } from "./types";
import { formatUsd } from "./utils";

const speedIcons: Record<string, React.ElementType> = {
  Economy: Clock,
  Standard: Gauge,
  Fast: Zap,
};

const txTypeIcons: Record<NonNullable<GasTxType["icon"]>, React.ElementType> = {
  transfer: Zap,
  swap: ArrowLeftRight,
  nft: ImageIcon,
  contract: FileCode,
};

export function GasCalculator({
  speeds,
  selectedSpeed,
  onSelect,
  ethPrice,
  txTypes,
  selectedTxType,
  onSelectTxType,
  baseFeeGwei,
  network,
  className,
}: GasCalculatorProps) {
  const activeSpeed = speeds.find((s) => s.name === selectedSpeed) ?? speeds[0];
  const activeTxType = txTypes?.find((t) => t.key === selectedTxType) ?? txTypes?.[0];
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
        {ethPrice != null && (
          <span className="ml-auto font-mono text-xs text-gray-500 dark:text-gray-400">
            ETH ${ethPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Transaction type (optional) */}
      {txTypes && txTypes.length > 0 && (
        <div className="px-4 pb-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Transaction Type
          </p>
          <div className="flex gap-1.5">
            {txTypes.map((t) => {
              const isActive = (selectedTxType ?? txTypes[0].key) === t.key;
              const Icon = t.icon ? txTypeIcons[t.icon] : Zap;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => onSelectTxType?.(t)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium transition-colors",
                    isActive
                      ? "border border-blue-500 bg-blue-50 text-gray-900 dark:border-blue-400 dark:bg-blue-950/40 dark:text-white"
                      : "border border-gray-200 bg-transparent text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900",
                  )}
                  aria-pressed={isActive}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400",
                    )}
                  />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Cost breakdown (optional) */}
      {activeSpeed && (activeTxType || baseFeeGwei != null) && (
        <div className="mx-4 mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Estimated Cost
            </span>
            {activeTxType && (
              <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
                {activeTxType.gasLimit.toLocaleString()} gas
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-base font-bold text-gray-900 dark:text-white">
              {activeSpeed.cost} ETH
            </span>
            {ethPrice != null && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formatUsd(parseFloat(activeSpeed.cost) * ethPrice)}
              </span>
            )}
          </div>
          {baseFeeGwei != null && (
            <div className="mt-2 flex gap-4 text-[11px] text-gray-500 dark:text-gray-400">
              <span>Base: {baseFeeGwei} gwei</span>
              <span>Priority: {Math.max(0, activeSpeed.gwei - baseFeeGwei)} gwei</span>
              <span>Total: {activeSpeed.gwei} gwei</span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {network && (
        <div className="border-t border-gray-200 px-4 py-2.5 text-center dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">{network}</p>
        </div>
      )}
    </div>
  );
}
