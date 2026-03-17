"use client";

import React, { useState, useCallback } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Token, WalletBalanceProps } from "./types";
import { formatBalance, formatCurrency, formatPercent } from "./utils";

export type { Token, WalletBalanceProps };

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  tokens,
  onTokenClick,
  className,
}) => {
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, token: Token) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onTokenClick?.(token);
      }
    },
    [onTokenClick]
  );

  // Empty state
  if (!tokens || tokens.length === 0) {
    return (
      <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Wallet className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No tokens found</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Connect a wallet to view your balances</p>
        </div>
      </div>
    );
  }

  const totalValue = tokens.reduce(
    (sum, token) => sum + Number(token.balance) * (token.price || 0),
    0
  );

  // Compute weighted 24h change across all tokens
  const totalChange24h = totalValue > 0
    ? tokens.reduce((sum, token) => {
        const value = Number(token.balance) * (token.price || 0);
        const change = token.priceChange24h ?? 0;
        return sum + (value / totalValue) * change;
      }, 0)
    : 0;

  const hasAnyChange = tokens.some((t) => t.priceChange24h != null);
  const isPositive = totalChange24h >= 0;

  const sortedTokens = [...tokens].sort(
    (a, b) =>
      Number(b.balance) * (b.price || 0) - Number(a.balance) * (a.price || 0)
  );

  // Generate colors for allocation bar (deterministic per symbol)
  const tokenColors: Record<string, string> = {};
  const palette = ["#627EEA", "#F7931A", "#2775CA", "#26A17B", "#00FFA3", "#E84142", "#8247E5", "#2B6CB0"];
  sortedTokens.forEach((token, i) => {
    tokenColors[token.symbol] = palette[i % palette.length];
  });

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          Total Balance
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {formatCurrency(totalValue)}
          </p>
          {hasAnyChange && (
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
          )}
        </div>

        {/* Allocation bar */}
        <div className="flex h-2 rounded-full overflow-hidden mt-3 bg-gray-100 dark:bg-gray-800">
          {sortedTokens.map((token) => {
            const value = Number(token.balance) * (token.price || 0);
            return (
              <div
                key={token.symbol}
                style={{
                  width: `${(value / totalValue) * 100}%`,
                  backgroundColor: tokenColors[token.symbol],
                }}
                className={cn(
                  "h-full transition-opacity duration-150",
                  hoveredSymbol && hoveredSymbol !== token.symbol && "opacity-30"
                )}
                onMouseEnter={() => setHoveredSymbol(token.symbol)}
                onMouseLeave={() => setHoveredSymbol(null)}
              />
            );
          })}
        </div>
      </div>

      {/* Token list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {sortedTokens.map((token) => {
          const value = Number(token.balance) * (token.price || 0);
          const pct = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : "0.0";
          const hasChange = token.priceChange24h != null;
          const assetPositive = (token.priceChange24h ?? 0) >= 0;
          const isClickable = !!onTokenClick;
          const isFaded = hoveredSymbol && hoveredSymbol !== token.symbol;

          return (
            <div
              key={token.symbol}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={isClickable ? (e) => handleKeyDown(e, token) : undefined}
              className={cn(
                "flex items-center justify-between px-4 py-3 transition-all duration-150",
                isClickable && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-inset",
                isFaded && "opacity-50"
              )}
              onClick={() => onTokenClick?.(token)}
              onMouseEnter={() => setHoveredSymbol(token.symbol)}
              onMouseLeave={() => setHoveredSymbol(null)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tokenColors[token.symbol] }}
                />
                <TokenIcon symbol={token.symbol} logoURI={token.logoURI} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{token.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {token.name} · {formatBalance(token.balance)} · {pct}%
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                  {formatCurrency(value)}
                </p>
                {hasChange && (
                  <p
                    className={cn(
                      "text-xs tabular-nums flex items-center justify-end gap-0.5",
                      assetPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {assetPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {formatPercent(token.priceChange24h!)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WalletBalance;
