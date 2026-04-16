"use client";

import { ArrowUpRight, ArrowDownRight, Droplets, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidityPoolStatsProps } from "./types";
import { formatCurrency, formatNumber, formatPercentage } from "./utils";

function ChangeIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      )}
    >
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {isPositive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function StatCell({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: number;
}) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-900">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
        {value}
      </p>
      {change != null && (
        <div className="mt-0.5">
          <ChangeIndicator value={change} />
        </div>
      )}
    </div>
  );
}

export function LiquidityPoolStats({
  pool,
  onAddLiquidity,
  onRemoveLiquidity,
  className,
}: LiquidityPoolStatsProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
            <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {pool.tokenPair}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {pool.fee}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold tabular-nums text-green-600 dark:text-green-400">
            {formatPercentage(pool.apr)}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            APR
          </p>
        </div>
      </div>

      {/* Stat grid — 2x3 */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <StatCell label="TVL" value={formatCurrency(pool.tvl)} change={pool.tvlChange24h} />
        <StatCell label="Volume (24h)" value={formatCurrency(pool.volume24h)} change={pool.volumeChange24h} />
        <StatCell label="Fees (24h)" value={pool.feesEarned24h != null ? formatCurrency(pool.feesEarned24h) : "--"} />
        <StatCell label="Transactions" value={pool.transactions24h != null ? formatNumber(pool.transactions24h) : "--"} />
        <StatCell label="Holders" value={pool.holders != null ? formatNumber(pool.holders) : "--"} />
        <StatCell label="APR" value={formatPercentage(pool.apr)} />
      </div>

      {/* Action buttons */}
      {(onAddLiquidity || onRemoveLiquidity) && (
        <div className="flex gap-2 border-t border-gray-200 px-3 py-3 dark:border-gray-800">
          {onAddLiquidity && (
            <button
              onClick={onAddLiquidity}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Liquidity
            </button>
          )}
          {onRemoveLiquidity && (
            <button
              onClick={onRemoveLiquidity}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Minus className="h-3.5 w-3.5" />
              Remove Liquidity
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2.5 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Pool stats updated in real-time
        </span>
      </div>
    </div>
  );
}

export default LiquidityPoolStats;
