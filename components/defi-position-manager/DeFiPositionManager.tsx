"use client";

import React from "react";
import { Layers } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Badge } from "../ui/badge";
import { PositionData, DeFiPositionManagerProps } from "./types";
import { formatCurrency, getRiskVariant, formatTimeAgo, capitalize } from "./utils";

export type { PositionData, DeFiPositionManagerProps };

function HealthIndicator({ value }: { value: number }) {
  const color = value >= 2 ? "text-green-600 dark:text-green-400" : value >= 1.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
  return (
    <span className={cn("text-[11px] font-medium tabular-nums", color)}>
      HF {value.toFixed(2)}
    </span>
  );
}

export const DeFiPositionManager: React.FC<DeFiPositionManagerProps> = ({ positions, className }) => {
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0);

  // Empty state
  if (!positions || positions.length === 0) {
    return (
      <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
            DeFi Positions
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Layers className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No positions</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your DeFi positions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          DeFi Positions
        </p>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      {/* Positions */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {positions.map((pos) => (
          <div key={pos.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <TokenIcon symbol={pos.token.symbol} logoURI={pos.token.logoURI} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                      {pos.amount} {pos.token.symbol}
                    </p>
                    <Badge variant={getRiskVariant(pos.risk)}>{capitalize(pos.risk)}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {pos.protocol.name} · {capitalize(pos.protocol.type)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">{formatCurrency(pos.value)}</p>
                <p className={cn("text-xs tabular-nums", pos.apy >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                  {pos.apy >= 0 ? "+" : ""}{pos.apy}% APY
                </p>
              </div>
            </div>

            {/* Health factor + rewards + last updated */}
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <HealthIndicator value={pos.healthFactor} />
              {pos.rewards.length > 0 && pos.rewards.map((r, i) => (
                <span key={i} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-full tabular-nums">
                  +{r.amount} {r.token} <span className="text-gray-400 dark:text-gray-500">({formatCurrency(r.value)})</span>
                </span>
              ))}
              <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">
                {formatTimeAgo(pos.lastUpdate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeFiPositionManager;
