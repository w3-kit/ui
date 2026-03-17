"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  decimals: number;
  logoURI: string;
  priceChange24h?: number;
}

export interface WalletBalanceProps {
  tokens: Token[];
  onTokenClick?: (token: Token) => void;
  className?: string;
}

function formatBalance(balance: string): string {
  const num = parseFloat(balance);
  if (isNaN(num)) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  if (num < 0.001 && num > 0) return "<0.001";
  return num.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  tokens,
  onTokenClick,
  className,
}) => {
  const totalValue = tokens.reduce(
    (sum, token) => sum + Number(token.balance) * (token.price || 0),
    0
  );

  const sortedTokens = [...tokens].sort(
    (a, b) =>
      Number(b.balance) * (b.price || 0) - Number(a.balance) * (a.price || 0)
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className
      )}
    >
      {/* Total balance header */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Total Balance
        </p>
        <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mt-1">
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Token list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {sortedTokens.map((token) => {
          const value = Number(token.balance) * (token.price || 0);
          const hasChange = token.priceChange24h != null;
          const isPositive = (token.priceChange24h ?? 0) >= 0;

          return (
            <div
              key={token.symbol}
              className={cn(
                "flex items-center justify-between px-4 py-3 transition-colors duration-150",
                onTokenClick
                  ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                  : ""
              )}
              onClick={() => onTokenClick?.(token)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <TokenIcon
                  symbol={token.symbol}
                  logoURI={token.logoURI}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {token.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatBalance(token.balance)} {token.symbol}
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
                      isPositive
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {isPositive ? "+" : ""}
                    {token.priceChange24h!.toFixed(2)}%
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
