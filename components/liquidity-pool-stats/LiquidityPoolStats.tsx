"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { PoolData, LiquidityPoolStatsProps } from "./types";
import { formatCurrency, formatNumber } from "./utils";

export type { PoolData, LiquidityPoolStatsProps };

function StatItem({ label, value, change }: { label: string; value: string; change?: number }) {
  return (
    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
      <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1 tabular-nums">{value}</p>
      {change != null && (
        <p className={cn("text-xs mt-0.5 flex items-center gap-0.5 tabular-nums", change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
          {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
        </p>
      )}
    </div>
  );
}

export const LiquidityPoolStats: React.FC<LiquidityPoolStatsProps> = ({ poolData, className }) => {
  const { token } = poolData;

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400 mb-2">
          Liquidity Pool
        </p>
        <div className="flex items-center gap-3">
          <TokenIcon symbol={token.symbol} logoURI={token.logoURI} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{token.symbol} Pool</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {poolData.fee / 100}% fee · ${formatNumber(token.price)} per {token.symbol}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-semibold text-green-600 dark:text-green-400 tabular-nums">
              {poolData.apr}%
            </p>
            <p className="text-[11px] uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500">APR</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <StatItem label="TVL" value={formatCurrency(poolData.tvl)} change={poolData.tvlChange24h} />
        <StatItem label="Volume (24h)" value={formatCurrency(poolData.volume24h)} change={poolData.volumeChange24h} />
        <StatItem label="Fees (24h)" value={formatCurrency(poolData.feesEarned24h)} />
        <StatItem label="Transactions (24h)" value={formatNumber(poolData.transactions24h)} />
        <StatItem label="Holders" value={formatNumber(poolData.uniqueHolders)} />
        <StatItem label="Market Cap" value={formatCurrency(token.marketCap)} />
      </div>
    </div>
  );
};

export default LiquidityPoolStats;
