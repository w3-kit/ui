"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Token, TokenListProps } from "./types";
import { formatBalance, formatCurrency } from "./utils";

export type { Token, TokenListProps };

export const TokenList: React.FC<TokenListProps> = ({ tokens, onTokenSelect, className }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <span>Token</span>
        <span className="w-24 text-right">Balance</span>
        <span className="w-24 text-right">Value</span>
      </div>

      {/* Token rows */}
      {tokens.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          No tokens found
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {tokens.map((token) => {
            const value =
              token.balance && token.price ? Number(token.balance) * token.price : undefined;

            return (
              <div
                key={token.symbol}
                className={cn(
                  "grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3 transition-colors duration-150",
                  onTokenSelect && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
                )}
                onClick={() => onTokenSelect?.(token)}
              >
                {/* Token info */}
                <div className="flex items-center gap-3 min-w-0">
                  <TokenIcon symbol={token.symbol} logoURI={token.logoURI} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {token.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{token.symbol}</p>
                  </div>
                </div>

                {/* Balance */}
                <div className="w-24 text-right">
                  <p className="text-sm text-gray-900 dark:text-white tabular-nums">
                    {token.balance ? formatBalance(token.balance) : "—"}
                  </p>
                </div>

                {/* Value */}
                <div className="w-24 text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                    {value != null ? formatCurrency(value) : "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TokenList;
