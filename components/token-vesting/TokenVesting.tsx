"use client";

import React, { useState } from "react";
import { Loader2, Clock } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { VestingSchedule, TokenVestingProps } from "./types";
import { calculateProgress, formatDate, isClaimable } from "./utils";

export type { VestingSchedule, TokenVestingProps };

const statusVariant = { active: "success", completed: "default", pending: "warning" } as const;

export const TokenVesting: React.FC<TokenVestingProps> = ({
  vestingSchedules,
  onClaimTokens,
  className,
}) => {
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    try {
      await onClaimTokens(id);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Clock className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Token Vesting</h3>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {vestingSchedules.map((schedule) => {
          const progress = calculateProgress(schedule);
          const canClaim = isClaimable(schedule);
          return (
            <div key={schedule.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {schedule.tokenSymbol}
                  </p>
                  <Badge variant={statusVariant[schedule.status]}>{schedule.status}</Badge>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {schedule.vestedAmount} / {schedule.totalAmount}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatDate(schedule.startDate)}</span>
                <span>{formatDate(schedule.endDate)}</span>
              </div>

              {canClaim && (
                <Button
                  onClick={() => handleClaim(schedule.id)}
                  disabled={claimingId === schedule.id}
                  size="sm"
                  className="w-full"
                >
                  {claimingId === schedule.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Claim Tokens"
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokenVesting;
