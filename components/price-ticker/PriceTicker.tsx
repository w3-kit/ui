"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Token, PriceTickerProps } from "./types";
import { formatCurrency, formatLargeNumber, formatPercentage } from "./utils";

export type { Token, PriceTickerProps };

export const PriceTicker: React.FC<PriceTickerProps> = ({
  tokens,
  className,
  onTokenClick,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Market Prices
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {tokens.length} tokens
        </span>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <span>Token</span>
        <span className="w-24 text-right">Price</span>
        <span className="w-20 text-right">24h</span>
        <span className="w-24 text-right hidden lg:block">Market Cap</span>
      </div>

      {/* Token rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {tokens.map((token) => {
          const isPositive = token.priceChange["24h"] >= 0;
          return (
            <div
              key={token.symbol}
              className={cn(
                "grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-4 py-3 transition-colors duration-150",
                onTokenClick
                  ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                  : ""
              )}
              onClick={() => onTokenClick?.(token)}
            >
              {/* Token info */}
              <div className="flex items-center gap-3 min-w-0">
                <TokenIcon
                  symbol={token.symbol}
                  logoURI={token.logoURI}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {token.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {token.symbol}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="w-24 text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                  {formatCurrency(token.price)}
                </p>
              </div>

              {/* 24h change */}
              <div className="w-20 text-right hidden sm:block">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    isPositive
                      ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(token.priceChange["24h"])}
                </span>
              </div>

              {/* Market cap */}
              <div className="w-24 text-right hidden lg:block">
                <p className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                  {formatLargeNumber(token.marketCap)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceTicker;
