"use client";

import React, { useState, useCallback } from "react";
import { TrendingUp, TrendingDown, Inbox } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Asset, AssetPortfolioProps } from "./types";
import { formatCurrency, formatPercent } from "./utils";

export type { Asset, AssetPortfolioProps };

/** Inline SVG sparkline with gradient fill and end dot. */
function Sparkline({ data, color, id, className }: { data: number[]; color: string; id: string; className?: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const pad = 2;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2),
  }));

  const linePath = coords.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  const last = coords[coords.length - 1];
  const gradId = `spark-${id}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} fill="none" className={cn("w-16 h-6", className)}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={linePath} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="2" fill={color} />
    </svg>
  );
}

export const AssetPortfolio: React.FC<AssetPortfolioProps> = ({
  assets,
  totalValue,
  totalChange24h,
  className,
  onAssetClick,
}) => {
  const isPositive = totalChange24h >= 0;
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, asset: Asset) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onAssetClick?.(asset);
      }
    },
    [onAssetClick]
  );

  // #7 — Empty state
  if (!assets || assets.length === 0) {
    return (
      <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Inbox className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No assets yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connect a wallet to view your portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Summary */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        {/* #5 — Uppercase stat label */}
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          Portfolio Value
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {formatCurrency(totalValue)}
          </p>
          {/* #4 — 24h label on change */}
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatPercent(totalChange24h)}
            <span className="text-gray-400 dark:text-gray-500 font-normal ml-0.5">24h</span>
          </span>
        </div>

        {/* #8 — Allocation bar with hover cross-linking */}
        <div className="flex h-2 rounded-full overflow-hidden mt-3 bg-gray-100 dark:bg-gray-800">
          {assets.map((asset) => (
            <div
              key={asset.symbol}
              style={{
                width: `${(asset.value / totalValue) * 100}%`,
                backgroundColor: asset.color,
              }}
              className={cn(
                "h-full transition-opacity duration-150",
                hoveredSymbol && hoveredSymbol !== asset.symbol && "opacity-30"
              )}
              onMouseEnter={() => setHoveredSymbol(asset.symbol)}
              onMouseLeave={() => setHoveredSymbol(null)}
            />
          ))}
        </div>
      </div>

      {/* Asset list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {assets.map((asset) => {
          const pct = ((asset.value / totalValue) * 100).toFixed(1);
          const assetPositive = asset.change24h >= 0;
          const isClickable = !!onAssetClick;
          const isHovered = hoveredSymbol === asset.symbol;
          const isFaded = hoveredSymbol && !isHovered;

          return (
            <div
              key={asset.symbol}
              // #3 — Keyboard accessibility
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={isClickable ? (e) => handleKeyDown(e, asset) : undefined}
              className={cn(
                "flex items-center justify-between px-4 py-3 transition-colors duration-150",
                isClickable && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-inset",
                // #8 — Cross-link hover: dim non-hovered rows
                isFaded && "opacity-50"
              )}
              onClick={() => onAssetClick?.(asset)}
              onMouseEnter={() => setHoveredSymbol(asset.symbol)}
              onMouseLeave={() => setHoveredSymbol(null)}
            >
              <div className="flex items-center gap-3">
                {/* #1 — Color dot linking bar to assets */}
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: asset.color }} />
                <TokenIcon symbol={asset.symbol} logoURI={asset.logoURI} size="md" />
                <div>
                  {/* #2 — Show asset name */}
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{asset.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {asset.name} · {asset.balance} · {pct}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* #5 — Sparkline from priceHistory */}
                {asset.priceHistory?.["24h"] && (
                  <Sparkline
                    data={asset.priceHistory["24h"]}
                    color={assetPositive ? "#16a34a" : "#dc2626"}
                    id={asset.symbol}
                  />
                )}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                    {formatCurrency(asset.value)}
                  </p>
                  <p
                    className={cn(
                      "text-xs tabular-nums",
                      assetPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {formatPercent(asset.change24h)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetPortfolio;
