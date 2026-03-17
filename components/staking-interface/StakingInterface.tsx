"use client";

import React, { useState } from "react";
import { Lock, Percent } from "lucide-react";
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

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Staking Pools</h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {pools.map((pool) => (
          <div key={pool.id}>
            <button
              onClick={() => setSelectedPool(selectedPool === pool.id ? null : pool.id)}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 text-left transition-colors duration-150",
                selectedPool === pool.id ? "bg-gray-50 dark:bg-gray-900" : "hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <TokenIcon symbol={pool.token.symbol} logoURI={pool.token.logoURI} size="md" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{pool.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Percent className="h-3 w-3" />{pool.apr}% APR
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Lock className="h-3 w-3" />{pool.lockPeriod}d lock
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Staked</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatNumber(pool.totalStaked)} {pool.token.symbol}</p>
              </div>
            </button>

            {selectedPool === pool.id && (
              <div className="px-4 pb-4 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsStaking(true)}
                    className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150",
                      isStaking ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    )}
                  >Stake</button>
                  <button
                    onClick={() => setIsStaking(false)}
                    className={cn("flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150",
                      !isStaking ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    )}
                  >Unstake</button>
                </div>
                <Input
                  type="number"
                  placeholder={`Min: ${pool.minStake} ${pool.token.symbol}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button onClick={handleAction} disabled={!amount} size="sm" className="w-full">
                  {isStaking ? "Stake" : "Unstake"} {pool.token.symbol}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StakingInterface;
