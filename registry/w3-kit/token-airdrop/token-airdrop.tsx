"use client";

import React from "react";
import { Gift, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TokenAirdropProps } from "./types";
import { statusColor } from "./utils";

export function TokenAirdrop({ airdrops, onClaim, claimingId, className }: TokenAirdropProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Gift className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Airdrops</h3>
        <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          {airdrops.length}
        </span>
      </div>

      {/* Airdrop list */}
      <div className="space-y-1.5 px-4 pb-4">
        {airdrops.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            No airdrops available
          </p>
        )}

        {airdrops.map((airdrop) => {
          const isClaiming = claimingId === airdrop.id;
          const isActive = airdrop.status === "active";

          return (
            <div key={airdrop.id} className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {airdrop.amount} {airdrop.token}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                        statusColor(airdrop.status),
                      )}
                    >
                      {airdrop.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {airdrop.startDate} - {airdrop.endDate}
                  </p>
                </div>

                {isActive && (
                  <button
                    onClick={() => onClaim?.(airdrop.id)}
                    disabled={isClaiming}
                    className={cn(
                      "ml-3 flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
                      isClaiming && "cursor-not-allowed opacity-60",
                    )}
                  >
                    {isClaiming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Claim"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
