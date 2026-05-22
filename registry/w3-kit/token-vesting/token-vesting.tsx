"use client";

import React from "react";
import { Check, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TokenVestingProps } from "./types";
import { vestingPercent } from "./utils";

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function TokenVesting({
  schedules,
  onClaim,
  claimingId,
  showCount = false,
  showProgressLabels = false,
  showFooter = false,
  className,
}: TokenVestingProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Vesting</h3>
        {showCount && (
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {schedules.length}
          </span>
        )}
      </div>

      {/* Schedule list */}
      <div className="space-y-1.5 px-4 pb-4">
        {schedules.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            No vesting schedules
          </p>
        )}

        {schedules.map((schedule) => {
          const isClaiming = claimingId === schedule.id;
          const pct = vestingPercent(schedule.vestedAmount, schedule.totalAmount);
          const isClaimable = schedule.status === "active" && pct < 100;

          const totalNum = parseFloat(schedule.totalAmount) || 0;
          const vestedNum = parseFloat(schedule.vestedAmount) || 0;
          const remaining = Math.max(0, totalNum - vestedNum);
          const fullyVested =
            schedule.status === "completed" ||
            (totalNum > 0 && pct >= 100 && !schedule.claimableAmount);

          return (
            <div key={schedule.id} className="rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-900">
              {/* Top row */}
              <div className="flex items-center gap-2">
                {schedule.logoURI && (
                  <img
                    src={schedule.logoURI}
                    alt={schedule.token}
                    className="h-7 w-7 shrink-0 rounded-full"
                  />
                )}
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {schedule.token}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                        statusColor[schedule.status] ?? statusColor.pending,
                      )}
                    >
                      {schedule.status}
                    </span>
                  </div>
                  <p className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
                    {schedule.vestedAmount} / {schedule.totalAmount}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              {showProgressLabels && (
                <div className="mt-2 flex items-center justify-between text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
                  <span>{pct}% vested</span>
                  <span>{remaining.toLocaleString("en-US")} remaining</span>
                </div>
              )}
              <div
                className={cn(
                  "h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
                  showProgressLabels ? "mt-1" : "mt-2",
                )}
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    schedule.status === "completed" ? "bg-green-500" : "bg-gray-900 dark:bg-white",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Dates */}
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Cliff: {schedule.cliffDate}</span>
                <span>End: {schedule.endDate}</span>
              </div>

              {/* Claim button */}
              {isClaimable && (
                <button
                  onClick={() => onClaim?.(schedule.id)}
                  disabled={isClaiming}
                  className={cn(
                    "mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
                    isClaiming && "cursor-not-allowed opacity-60",
                  )}
                >
                  {isClaiming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : schedule.claimableAmount ? (
                    `Claim ${schedule.claimableAmount}`
                  ) : (
                    "Claim"
                  )}
                </button>
              )}

              {/* Completed message */}
              {fullyVested && !isClaimable && (
                <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-700 dark:text-green-400">
                  <Check className="h-3.5 w-3.5" />
                  Fully vested &amp; claimed
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showFooter && (
        <div className="border-t border-gray-200 px-5 py-3 text-center dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {schedules.length} schedule{schedules.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
