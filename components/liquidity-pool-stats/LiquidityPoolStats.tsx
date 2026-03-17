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
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
      {change != null && (
        <p className={cn("text-xs mt-0.5 flex items-center gap-0.5", change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
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
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <TokenIcon symbol={token.symbol} logoURI={token.logoURI} size="md" />
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{token.symbol} Pool</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{poolData.fee / 100}% fee tier</p>
        </div>
        <span className="ml-auto text-xs font-medium text-green-600 dark:text-green-400">{poolData.apr}% APR</span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        <StatItem label="TVL" value={formatCurrency(poolData.tvl)} change={poolData.tvlChange24h} />
        <StatItem label="Volume (24h)" value={formatCurrency(poolData.volume24h)} change={poolData.volumeChange24h} />
        <StatItem label="Fees (24h)" value={formatCurrency(poolData.feesEarned24h)} />
        <StatItem label="Holders" value={formatNumber(poolData.uniqueHolders)} />
      </div>
    </div>
  );
};

export default LiquidityPoolStats;
