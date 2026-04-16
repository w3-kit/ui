"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { TokenCardData, TokenCardProps } from "./types";
import { formatCurrency, formatPercent } from "./utils";

export function TokenCard({ token, onClick, className }: TokenCardProps) {
  const change = token.priceChange24h ?? 0;
  const hasBalance = token.balance !== undefined;
  const value = hasBalance ? token.balance! * token.price : undefined;

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        onClick && "cursor-pointer transition-shadow hover:shadow-md",
        className,
      )}
      onClick={() => onClick?.(token)}
    >
      {/* Header: logo + symbol + change badge */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        {token.logoURI ? (
          <img src={token.logoURI} alt={token.symbol} className="h-8 w-8 rounded-full" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {token.symbol.slice(0, 2)}
          </div>
        )}
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {token.symbol}
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            change >= 0
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          {formatPercent(change)}
        </span>
      </div>

      {/* Large price */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {formatCurrency(token.price)}
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-200 dark:border-gray-800 dark:bg-gray-800">
        {hasBalance && (
          <div className="bg-white px-4 py-3 dark:bg-gray-950">
            <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
            <p className="text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100">
              {token.balance!.toFixed(4)} {token.symbol}
            </p>
          </div>
        )}

        {value !== undefined && (
          <div className="bg-white px-4 py-3 dark:bg-gray-950">
            <p className="text-xs text-gray-500 dark:text-gray-400">Value</p>
            <p className="text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100">
              {formatCurrency(value)}
            </p>
          </div>
        )}

        <div
          className={cn(
            "bg-white px-4 py-3 dark:bg-gray-950",
            !hasBalance && "col-span-2",
          )}
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">24h Change</p>
          <p
            className={cn(
              "text-sm font-medium",
              change >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400",
            )}
          >
            {formatPercent(change)}
          </p>
        </div>

        {!hasBalance && <div className="bg-white dark:bg-gray-950" />}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2.5 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">{token.name}</p>
      </div>
    </div>
  );
}
