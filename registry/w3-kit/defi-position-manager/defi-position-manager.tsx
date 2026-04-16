"use client";

import React from "react";
import { BarChart3, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Position, DeFiPositionManagerProps } from "./types";

function healthFactorColor(hf: number) {
  if (hf >= 2) return "bg-green-500";
  if (hf >= 1.5) return "bg-yellow-500";
  return "bg-red-500";
}

function healthFactorText(hf: number) {
  if (hf >= 2) return "text-green-600 dark:text-green-400";
  if (hf >= 1.5) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function riskBadge(risk: Position["risk"]) {
  const map = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return map[risk];
}

function totalValue(positions: Position[]) {
  return positions
    .reduce((sum, p) => sum + parseFloat(p.value.replace(/[^0-9.]/g, "")), 0)
    .toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export const DeFiPositionManager: React.FC<DeFiPositionManagerProps> = ({
  positions,
  onPositionClick,
  className,
}) => (
  <div
    className={cn(
      "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
      className,
    )}
  >
    {/* Header */}
    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
      <div className="flex items-center gap-2.5">
        <BarChart3 className="h-5 w-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          DeFi Positions
        </h2>
      </div>
      <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
        {totalValue(positions)}
      </span>
    </div>

    {/* Position rows */}
    <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
      {positions.map((pos) => (
        <button
          key={pos.id}
          type="button"
          onClick={() => onPositionClick?.(pos)}
          className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/40"
        >
          {/* Protocol icon */}
          {pos.protocolIcon ? (
            <img
              src={pos.protocolIcon}
              alt={pos.protocol}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              {pos.protocol.charAt(0)}
            </div>
          )}

          {/* Token info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {pos.amount} {pos.token}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                  riskBadge(pos.risk),
                )}
              >
                {pos.risk}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {pos.protocol}
            </span>
          </div>

          {/* Health factor bar */}
          {pos.healthFactor != null && (
            <div className="hidden w-24 flex-col gap-1 sm:flex">
              <div className="flex items-center justify-between">
                <Shield className="h-3 w-3 text-gray-400" />
                <span
                  className={cn(
                    "text-[10px] font-medium tabular-nums",
                    healthFactorText(pos.healthFactor),
                  )}
                >
                  {pos.healthFactor.toFixed(2)}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    healthFactorColor(pos.healthFactor),
                  )}
                  style={{
                    width: `${Math.min((pos.healthFactor / 3) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Value + APY */}
          <div className="shrink-0 text-right">
            <span className="block text-sm font-medium tabular-nums text-gray-900 dark:text-white">
              {pos.value}
            </span>
            <span className="flex items-center justify-end gap-1 text-xs tabular-nums text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3" />
              {pos.apy}%
            </span>
          </div>
        </button>
      ))}
    </div>

    {/* Footer */}
    <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-800">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {positions.length} position{positions.length !== 1 && "s"}
      </span>
    </div>
  </div>
);
