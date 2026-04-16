"use client";

import React, { useState, useMemo } from "react";
import { RefreshCw, Send, ArrowLeftRight, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WalletBalanceProps, Token } from "./types";
import {
  tokenValue,
  totalPortfolioValue,
  weightedChange24h,
  formatCurrency,
  formatBalance,
  getAllocationColor,
  sortByValue,
} from "./utils";

function TokenLogo({ token, size = 32 }: { token: Token; size?: number }) {
  if (token.logoURI) {
    return (
      <img
        src={token.logoURI}
        alt={token.symbol}
        width={size}
        height={size}
        className="shrink-0 rounded-full bg-gray-50 object-contain dark:bg-gray-800"
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{
        width: size,
        height: size,
        background: token.color ?? "#888",
      }}
    >
      {token.symbol.slice(0, 2)}
    </span>
  );
}

export function WalletBalance({
  tokens,
  onTokenClick,
  onSend,
  onSwap,
  onRefresh,
  showAllocation = true,
  className,
}: WalletBalanceProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sorted = useMemo(() => sortByValue(tokens), [tokens]);
  const total = useMemo(() => totalPortfolioValue(tokens), [tokens]);
  const change24h = useMemo(() => weightedChange24h(tokens), [tokens]);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <Wallet size={18} className="text-gray-900 dark:text-gray-100" />
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Balance</span>
        </div>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50 dark:hover:bg-gray-800"
          >
            <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
          </button>
        )}
      </div>

      {/* Total value */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Total Value
        </p>
        <div className="mt-1 flex items-baseline gap-2.5">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(total)}
          </span>
          {change24h !== 0 && (
            <span
              className={cn(
                "text-sm font-medium",
                change24h > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400",
              )}
            >
              {change24h > 0 ? "+" : ""}
              {change24h.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Allocation bar */}
        {showAllocation && sorted.length > 0 && total > 0 && (
          <div className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
            {sorted.map((token, i) => {
              const pct = (tokenValue(token) / total) * 100;
              if (pct < 0.5) return null;
              return (
                <div
                  key={token.symbol}
                  className="rounded-full transition-opacity"
                  style={{
                    flex: pct,
                    background: getAllocationColor(i, token),
                    opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.3 : 1,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Token list */}
      <div className="flex flex-col gap-0.5 px-3 pb-3">
        {sorted.map((token, i) => {
          const value = tokenValue(token);
          const pct = total > 0 ? (value / total) * 100 : 0;
          const isHovered = hoveredIndex === i;

          return (
            <button
              key={token.symbol}
              onClick={() => onTokenClick?.(token)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-all",
                "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                hoveredIndex !== null && !isHovered && "opacity-50",
              )}
            >
              <TokenLogo token={token} size={36} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
                    {token.symbol}
                  </span>
                  {token.priceChange24h !== undefined && (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        token.priceChange24h > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400",
                      )}
                    >
                      {token.priceChange24h > 0 ? "+" : ""}
                      {token.priceChange24h.toFixed(1)}%
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{token.name}</span>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
                  {formatBalance(token.balance)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(value)}</p>
              </div>
            </button>
          );
        })}

        {sorted.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            No tokens found
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {tokens.length} token{tokens.length !== 1 ? "s" : ""} · {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

export default WalletBalance;
