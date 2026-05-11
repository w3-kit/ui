"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PriceTickerProps, TickerToken } from "./types";
import { formatCurrency, formatPercent, formatMarketCap, sparklinePath } from "./utils";

export function PriceTicker({
  tokens,
  onTokenClick,
  emptyMessage = "No tokens to display",
  className,
}: PriceTickerProps) {
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
        {tokens.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </li>
        )}
        {tokens.map((token: TickerToken) => {
          const positive = token.priceChange24h >= 0;
          const TrendIcon = positive ? TrendingUp : TrendingDown;
          return (
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

              {/* Name + symbol + market cap */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{token.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {token.symbol}
                  {token.marketCap !== undefined && (
                    <>
                      <span className="mx-1.5">·</span>
                      {formatMarketCap(token.marketCap)}
                    </>
                  )}
                </p>
              </div>

              {/* Sparkline (optional) */}
              {token.sparkline && token.sparkline.length > 1 && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 60 20"
                  className={cn(
                    "hidden h-5 w-14 shrink-0 sm:block",
                    positive ? "text-green-500" : "text-red-500",
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={sparklinePath(token.sparkline, 60, 20)} />
                </svg>
              )}

              {/* Price + change pill */}
              <div className="flex flex-col items-end gap-0.5">
                <p className="text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100">
                  {formatCurrency(token.price)}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums",
                    positive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                  )}
                  aria-label={`${positive ? "Up" : "Down"} ${Math.abs(token.priceChange24h).toFixed(2)} percent in 24 hours`}
                >
                  <TrendIcon className="h-3 w-3" aria-hidden="true" />
                  {formatPercent(token.priceChange24h)}
                </span>
              </div>
            </li>
          );
        })}
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
