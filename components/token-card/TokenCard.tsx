"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Token, TokenCardProps } from "./types";
import { formatCurrency, formatBalance, formatPercentage } from "./utils";

export type { Token, TokenCardProps };

export const TokenCard: React.FC<TokenCardProps> = ({ token, onClick, className }) => {
  const hasPrice = token.price != null;
  const hasBalance = token.balance != null;
  const hasChange = token.priceChange24h != null;
  const isPositive = (token.priceChange24h ?? 0) >= 0;
  const totalValue = hasPrice && hasBalance ? Number(token.balance) * token.price! : undefined;

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={() => onClick?.(token)}
    >
      {/* Token header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TokenIcon symbol={token.symbol} logoURI={token.logoURI} size="lg" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{token.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{token.symbol}</p>
          </div>
        </div>

        {hasChange && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatPercentage(token.priceChange24h!)}
          </span>
        )}
      </div>

      {/* Stats */}
      {(hasPrice || hasBalance) && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          {hasPrice && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(token.price!)}
              </p>
            </div>
          )}
          {hasBalance && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatBalance(token.balance!)} {token.symbol}
              </p>
            </div>
          )}
          {totalValue != null && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenCard;
