"use client";

import React, { useState } from "react";
import { Coins, Lock, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StakingPool, StakingInterfaceProps } from "./types";
import { formatNumber } from "./utils";

export function StakingInterface({
  pools,
  onStake,
  onUnstake,
  stakingPoolId,
  className,
}: StakingInterfaceProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isStaking, setIsStaking] = useState(true);
  const [amount, setAmount] = useState("");

  const toggle = (id: string) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    setIsStaking(true);
    setAmount("");
  };

  const handleAction = (pool: StakingPool) => {
    if (!amount || Number(amount) <= 0) return;
    if (isStaking) {
      onStake?.(pool.id, amount);
    } else {
      onUnstake?.(pool.id, amount);
    }
    setAmount("");
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Staking Pools
        </h2>
        <span className="ml-auto text-xs text-gray-500">{pools.length} pools</span>
      </div>

      {/* Pool list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
        {pools.map((pool) => {
          const expanded = expandedId === pool.id;
          const loading = stakingPoolId === pool.id;

          return (
            <div key={pool.id}>
              {/* Pool row */}
              <button
                type="button"
                onClick={() => toggle(pool.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {pool.icon ? (
                  <img
                    src={pool.icon}
                    alt={pool.token}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {pool.token.slice(0, 2)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {pool.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {pool.apr}% APR
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      {pool.lockPeriod}d
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatNumber(pool.totalStaked)} {pool.token}
                  </p>
                  {pool.userStaked && (
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {formatNumber(pool.userStaked)} staked
                    </p>
                  )}
                </div>

                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                    expanded && "rotate-180",
                  )}
                />
              </button>

              {/* Expanded panel */}
              {expanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
                  {/* Stake / Unstake toggle */}
                  <div className="mb-3 flex gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
                    {(["Stake", "Unstake"] as const).map((label) => {
                      const active =
                        (label === "Stake" && isStaking) ||
                        (label === "Unstake" && !isStaking);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setIsStaking(label === "Stake")}
                          className={cn(
                            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                            active
                              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Amount input */}
                  <div className="mb-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) =>
                        /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)
                      }
                      className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
                    />
                    <span className="text-xs font-medium text-gray-500">{pool.token}</span>
                  </div>

                  {pool.minStake && (
                    <p className="mb-3 text-xs text-gray-500">
                      Min: {formatNumber(pool.minStake)} {pool.token}
                    </p>
                  )}

                  {/* Action button */}
                  <button
                    type="button"
                    disabled={!amount || Number(amount) <= 0 || loading}
                    onClick={() => handleAction(pool)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>{isStaking ? "Stake" : "Unstake"} {pool.token}</>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StakingInterface;
