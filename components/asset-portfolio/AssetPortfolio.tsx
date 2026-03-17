"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Asset, AssetPortfolioProps } from "./types";
import { formatCurrency, formatPercent } from "./utils";

export type { Asset, AssetPortfolioProps };

export const AssetPortfolio: React.FC<AssetPortfolioProps> = ({
  assets,
  totalValue,
  totalChange24h,
  className,
  onAssetClick,
}) => {
  const isPositive = totalChange24h >= 0;

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Summary */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio Value</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
          <span className={cn("flex items-center gap-0.5 text-xs font-medium", isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatPercent(totalChange24h)}
          </span>
        </div>

        {/* Allocation bar */}
        <div className="flex h-2 rounded-full overflow-hidden mt-3 bg-gray-100 dark:bg-gray-800">
          {assets.map((asset) => (
            <div key={asset.symbol} style={{ width: `${(asset.value / totalValue) * 100}%`, backgroundColor: asset.color }} className="h-full" />
          ))}
        </div>
      </div>

      {/* Asset list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {assets.map((asset) => {
          const pct = ((asset.value / totalValue) * 100).toFixed(1);
          const assetPositive = asset.change24h >= 0;
          return (
            <div
              key={asset.symbol}
              className={cn("flex items-center justify-between px-4 py-3 transition-colors duration-150", onAssetClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900")}
              onClick={() => onAssetClick?.(asset)}
            >
              <div className="flex items-center gap-3">
                <TokenIcon symbol={asset.symbol} logoURI={asset.logoURI} size="md" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{asset.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{asset.balance} · {pct}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">{formatCurrency(asset.value)}</p>
                <p className={cn("text-xs tabular-nums", assetPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                  {formatPercent(asset.change24h)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetPortfolio;
