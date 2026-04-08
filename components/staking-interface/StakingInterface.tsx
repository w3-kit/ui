"use client";

import React, { useState } from "react";
import { Lock, Percent, ChevronDown, Layers, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { StakingPool, StakingInterfaceProps } from "./types";
import { formatNumber } from "./utils";

export type { StakingPool, StakingInterfaceProps };

export const StakingInterface: React.FC<StakingInterfaceProps> = ({
  pools,
  onStake,
  onUnstake,
  loadingPoolId,
  className,
}) => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isStaking, setIsStaking] = useState(true);

  const handleAction = () => {
    if (!selectedPool || !amount) return;
    if (isStaking) onStake?.(selectedPool, amount);
    else onUnstake?.(selectedPool, amount);
    setAmount("");
  };

  // Empty state
  if (!pools || pools.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
          className,
        )}
      >
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
            Staking Pools
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Layers className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No pools available</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Staking pools will appear here when configured
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          Staking Pools
        </p>
        <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
          {pools.length} {pools.length === 1 ? "pool" : "pools"}
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {pools.map((pool) => {
          const isExpanded = selectedPool === pool.id;
          const isLoading = loadingPoolId === pool.id;
          const minStakeNum = parseFloat(pool.minStake);
          const amountNum = parseFloat(amount);
          const isBelowMin =
            isStaking && amount !== "" && !isNaN(amountNum) && amountNum < minStakeNum;

          return (
            <div key={pool.id}>
              <button
                onClick={() => {
                  setSelectedPool(isExpanded ? null : pool.id);
                  setAmount("");
                }}
                className={cn(
                  "flex items-center justify-between w-full px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-inset",
                  isExpanded
                    ? "bg-gray-50 dark:bg-gray-900"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900",
                )}
              >
                <div className="flex items-center gap-3">
                  <TokenIcon symbol={pool.token.symbol} logoURI={pool.token.logoURI} size="md" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{pool.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                        <Percent className="h-3 w-3" />
                        {pool.apr}% APR
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Lock className="h-3 w-3" />
                        {pool.lockPeriod}d lock
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500">
                      Total Staked
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                      {formatNumber(pool.totalStaked)} {pool.token.symbol}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-150",
                      isExpanded && "rotate-180",
                    )}
                  />
                </div>
              </button>

              {/* Expandable form */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 space-y-3">
                  {/* Stake / Unstake toggle */}
                  <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <button
                      onClick={() => {
                        setIsStaking(true);
                        setAmount("");
                      }}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
                        isStaking
                          ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                      )}
                    >
                      Stake
                    </button>
                    <button
                      onClick={() => {
                        setIsStaking(false);
                        setAmount("");
                      }}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
                        !isStaking
                          ? "bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                      )}
                    >
                      Unstake
                    </button>
                  </div>

                  {/* Amount input */}
                  <div>
                    <Input
                      type="number"
                      placeholder={`Amount in ${pool.token.symbol}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min={isStaking ? pool.minStake : undefined}
                      step="any"
                      className={cn(isBelowMin && "border-red-300 dark:border-red-800")}
                    />
                    {isBelowMin ? (
                      <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
                        Minimum stake: {pool.minStake} {pool.token.symbol}
                      </p>
                    ) : isStaking ? (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                        Min: {pool.minStake} {pool.token.symbol}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    onClick={handleAction}
                    disabled={!amount || isBelowMin || isLoading}
                    size="sm"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        {isStaking ? "Stake" : "Unstake"} {pool.token.symbol}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StakingInterface;
