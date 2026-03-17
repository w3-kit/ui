"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Badge } from "../ui/badge";
import { PositionData, DeFiPositionManagerProps } from "./types";
import { formatCurrency, getRiskVariant } from "./utils";

export type { PositionData, DeFiPositionManagerProps };

export const DeFiPositionManager: React.FC<DeFiPositionManagerProps> = ({ positions, className }) => {
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">DeFi Positions</h3>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(totalValue)}</span>
      </div>

      {positions.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-400">No positions</div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {positions.map((pos) => (
            <div key={pos.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TokenIcon symbol={pos.token.symbol} logoURI={pos.token.logoURI} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{pos.amount} {pos.token.symbol}</p>
                      <Badge variant={getRiskVariant(pos.risk)}>{pos.risk}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{pos.protocol.name} · {pos.protocol.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(pos.value)}</p>
                  <p className={cn("text-xs", pos.apy >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                    {pos.apy >= 0 ? "+" : ""}{pos.apy}% APY
                  </p>
                </div>
              </div>
              {pos.rewards.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {pos.rewards.map((r, i) => (
                    <span key={i} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-full">
                      +{r.amount} {r.token}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeFiPositionManager;
