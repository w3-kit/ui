"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PriceTickerProps } from "./types";
import { formatCurrency, formatPercent, formatMarketCap } from "./utils";

export function PriceTicker({ tokens, onTokenClick, className }: PriceTickerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Market</h3>
      </div>

      {/* Token rows */}
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {tokens.map((token) => (
          <li
            key={token.symbol}
            className={cn(
              "flex items-center gap-3 px-4 py-3 transition-colors",
              onTokenClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
            )}
            onClick={() => onTokenClick?.(token)}
          >
            {/* Logo */}
            {token.logoURI ? (
              <img src={token.logoURI} alt={token.symbol} className="h-8 w-8 rounded-full" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {token.symbol.slice(0, 2)}
              </div>
            )}

            {/* Name + symbol */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{token.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{token.symbol}</p>
            </div>

            {/* Price */}
            <p className="text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100">
              {formatCurrency(token.price)}
            </p>

            {/* 24h change pill */}
            <span
              className={cn(
                "inline-flex min-w-[4.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                token.priceChange24h >= 0
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
              )}
            >
              {formatPercent(token.priceChange24h)}
            </span>

            {/* Market cap (optional) */}
            {token.marketCap !== undefined && (
              <p className="hidden min-w-[4rem] text-right text-xs text-gray-500 dark:text-gray-400 sm:block">
                {formatMarketCap(token.marketCap)}
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2.5 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {tokens.length} token{tokens.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
