"use client";

import React from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListToken, TokenListProps } from "./types";
import { formatCurrency } from "./utils";

export function TokenList({ tokens, onTokenSelect, className }: TokenListProps) {
  const sorted = [...tokens].sort((a, b) => b.balance * b.price - a.balance * a.price);
  const totalValue = sorted.reduce((sum, t) => sum + t.balance * t.price, 0);

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <List className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Tokens</h3>
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{sorted.length}</span>
      </div>

      {/* Token rows */}
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {sorted.map((token) => {
          const value = token.balance * token.price;
          return (
            <li
              key={token.symbol}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors",
                onTokenSelect && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
              )}
              onClick={() => onTokenSelect?.(token)}
            >
              {/* Logo */}
              {token.logoURI ? (
                <img src={token.logoURI} alt={token.symbol} className="h-8 w-8 rounded-full" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {token.symbol.slice(0, 2)}
                </div>
              )}

              {/* Symbol + name */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {token.symbol}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{token.name}</p>
              </div>

              {/* Balance */}
              <p className="text-sm tabular-nums text-gray-500 dark:text-gray-400">
                {token.balance.toFixed(4)}
              </p>

              {/* Value */}
              <p className="min-w-[5rem] text-right text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100">
                {formatCurrency(value)}
              </p>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {sorted.length} token{sorted.length !== 1 ? "s" : ""}
        </p>
        <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
          {formatCurrency(totalValue)}
        </p>
      </div>
    </div>
  );
}
