"use client";

import React from "react";
import { Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TokenVestingProps } from "./types";
import { vestingPercent } from "./utils";

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function TokenVesting({ schedules, onClaim, claimingId, className }: TokenVestingProps) {
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

          return (
            <div key={schedule.id} className="rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-900">
              {/* Top row */}
              <div className="flex items-center justify-between">
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

              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-500 dark:bg-white"
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
                  {isClaiming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
