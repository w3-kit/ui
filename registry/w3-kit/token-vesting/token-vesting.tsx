"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VestingSchedule, TokenVestingProps } from "./types";
import {
  calculateProgress,
  formatDate,
  isClaimable,
  statusConfig,
  animationStyles,
} from "./utils";

const StatusBadge: React.FC<{ status: VestingSchedule["status"] }> = ({
  status,
}) => {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export const TokenVesting: React.FC<TokenVestingProps> = ({
  vestingSchedules,
  onClaimTokens,
}) => {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = animationStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const handleClaim = async (e: React.MouseEvent, scheduleId: string) => {
    e.stopPropagation();
    try {
      setClaimingId(scheduleId);
      await onClaimTokens(scheduleId);
    } finally {
      setClaimingId(null);
    }
  };

  const sortedSchedules = useMemo(() => {
    return [...vestingSchedules].sort((a, b) => {
      const statusOrder = { active: 0, pending: 1, completed: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [vestingSchedules]);

  return (
    <div className="space-y-4">
      {sortedSchedules.map((schedule, index) => (
        <Card
          key={schedule.id}
          className="group cursor-pointer transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          onClick={() =>
            setExpandedId(expandedId === schedule.id ? null : schedule.id)
          }
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-lg">
                  {schedule.tokenSymbol} Vesting
                </CardTitle>
                <StatusBadge status={schedule.status} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full transition-transform duration-200
                  ${expandedId === schedule.id ? "rotate-180" : ""}`}
              >
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">
                {calculateProgress(schedule).toFixed(1)}%
              </span>
            </div>
            <div className="relative w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                  animate-shimmer"
                style={{ "--tw-translate-x": "-100%" } as React.CSSProperties}
              />
              <div
                className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${calculateProgress(schedule)}%` }}
              />
            </div>

            <div
              className={`mt-4 transition-all duration-300 ease-out overflow-hidden
                ${expandedId === schedule.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <p className="text-sm text-muted-foreground mb-4">
                {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-secondary p-4 rounded-lg transition-colors duration-200 hover:bg-secondary/80">
                  <span className="text-muted-foreground text-sm">
                    Total Amount
                  </span>
                  <p className="font-medium text-foreground mt-1">
                    {schedule.totalAmount} {schedule.tokenSymbol}
                  </p>
                </div>
                <div className="bg-secondary p-4 rounded-lg transition-colors duration-200 hover:bg-secondary/80">
                  <span className="text-muted-foreground text-sm">
                    Vested Amount
                  </span>
                  <p className="font-medium text-foreground mt-1">
                    {schedule.vestedAmount} {schedule.tokenSymbol}
                  </p>
                </div>
                <div className="bg-secondary p-4 rounded-lg transition-colors duration-200 hover:bg-secondary/80">
                  <span className="text-muted-foreground text-sm">
                    Cliff Date
                  </span>
                  <p className="font-medium text-foreground mt-1">
                    {formatDate(schedule.cliffDate)}
                  </p>
                </div>
                <div className="bg-secondary p-4 rounded-lg transition-colors duration-200 hover:bg-secondary/80">
                  <span className="text-muted-foreground text-sm">
                    Last Claimed
                  </span>
                  <p className="font-medium text-foreground mt-1">
                    {schedule.lastClaimDate
                      ? formatDate(schedule.lastClaimDate)
                      : "Never"}
                  </p>
                </div>
              </div>

              {isClaimable(schedule) && (
                <Button
                  onClick={(e) => handleClaim(e, schedule.id)}
                  disabled={claimingId === schedule.id}
                  className="w-full mt-4"
                >
                  {claimingId === schedule.id ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Claiming Tokens...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Claim Available Tokens
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TokenVesting;
