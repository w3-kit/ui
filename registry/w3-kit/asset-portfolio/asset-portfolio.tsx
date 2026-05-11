"use client";

import React, { useState } from "react";
import { PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Asset, AssetPortfolioProps } from "./types";
import { formatCurrency, formatPercent } from "./utils";

const FALLBACK_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

function getColor(asset: Asset, index: number): string {
  return asset.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export function AssetPortfolio({
  assets,
  totalValue,
  totalChange24h,
  onAssetClick,
  showAllocation = true,
  className,
}: AssetPortfolioProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sorted = [...assets].sort((a, b) => b.value - a.value);

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <PieChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Portfolio</h3>
      </div>

      {/* Total */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(totalValue)}
        </p>
        <p
          className={cn(
            "text-sm font-medium",
            totalChange24h >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {formatPercent(totalChange24h)}
        </p>
      </div>

      {/* Allocation bar */}
      {showAllocation && totalValue > 0 && (
        <div className="px-4 pb-3">
          <div className="flex h-2 w-full overflow-hidden rounded-full">
            {sorted.map((asset, i) => {
              const pct = (asset.value / totalValue) * 100;
              return (
                <div
                  key={asset.symbol}
                  className={cn(
                    "transition-opacity duration-200",
                    hoveredIndex !== null && hoveredIndex !== i && "opacity-30",
                  )}
                  style={{ width: `${pct}%`, backgroundColor: getColor(asset, i) }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Asset list */}
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {sorted.map((asset, i) => (
          <li
            key={asset.symbol}
            className={cn(
              "flex items-center gap-3 px-4 py-3 transition-colors",
              onAssetClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
              hoveredIndex !== null && hoveredIndex !== i && "opacity-50",
            )}
            onClick={() => onAssetClick?.(asset)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {asset.logoURI ? (
              <img src={asset.logoURI} alt={asset.symbol} className="h-8 w-8 rounded-full" />
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: getColor(asset, i) }}
              >
                {asset.symbol.slice(0, 2)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{asset.symbol}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{asset.name}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(asset.value)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {asset.balance.toFixed(4)} {asset.symbol}
              </p>
            </div>

            <span
              className={cn(
                "min-w-[4rem] text-right text-xs font-medium",
                asset.change24h >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {formatPercent(asset.change24h)}
            </span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2.5 text-center dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {sorted.length} asset{sorted.length !== 1 ? "s" : ""}
          {totalValue > 0 && <> &middot; {formatCurrency(totalValue)}</>}
        </p>
      </div>
    </div>
  );
}
