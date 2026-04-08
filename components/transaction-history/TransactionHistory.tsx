"use client";

import React, { useCallback } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  FileCode,
  ArrowLeftRight,
  ShieldCheck,
  History,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { StatusDot } from "../ui/status-dot";
import { Transaction, TransactionHistoryProps, TransactionType } from "./types";
import { formatAddress, formatTimestamp, formatEther } from "./utils";

export type { Transaction, TransactionHistoryProps };

const statusMap = {
  success: "success",
  pending: "pending",
  failed: "error",
} as const;

const statusLabel: Record<string, string> = {
  success: "Confirmed",
  pending: "Pending",
  failed: "Failed",
};

const typeConfig: Record<TransactionType, { label: string; icon: typeof ArrowUpRight }> = {
  send: { label: "Sent", icon: ArrowUpRight },
  receive: { label: "Received", icon: ArrowDownLeft },
  contract: { label: "Contract Call", icon: FileCode },
  swap: { label: "Swap", icon: ArrowLeftRight },
  approve: { label: "Approval", icon: ShieldCheck },
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onTransactionClick,
  className,
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, tx: Transaction) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onTransactionClick?.(tx);
      }
    },
    [onTransactionClick],
  );

  const pendingCount = transactions.filter((tx) => tx.status === "pending").length;
  const failedCount = transactions.filter((tx) => tx.status === "failed").length;

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
          Transactions
        </p>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <StatusDot status="pending" />
              {pendingCount}
            </span>
          )}
          {failedCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
              <StatusDot status="error" />
              {failedCount}
            </span>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {transactions.length} total
          </span>
        </div>
      </div>

      {/* Empty state */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <History className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No transactions yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Transactions will appear here once processed
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((tx) => {
            const config = typeConfig[tx.type] ?? typeConfig.send;
            const Icon = config.icon;
            const isClickable = !!onTransactionClick;
            const symbol = tx.tokenSymbol ?? "ETH";

            return (
              <div
                key={tx.hash}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable ? (e) => handleKeyDown(e, tx) : undefined}
                className={cn(
                  "flex items-center justify-between px-4 py-3 transition-colors duration-150",
                  isClickable &&
                    "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-inset",
                )}
                onClick={() => onTransactionClick?.(tx)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      tx.type === "receive"
                        ? "bg-green-50 dark:bg-green-950"
                        : tx.status === "failed"
                          ? "bg-red-50 dark:bg-red-950"
                          : "bg-gray-100 dark:bg-gray-800",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        tx.type === "receive"
                          ? "text-green-600 dark:text-green-400"
                          : tx.status === "failed"
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-500 dark:text-gray-400",
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {config.label}
                      </p>
                      <span
                        className={cn(
                          "text-[11px] font-medium flex items-center gap-1",
                          tx.status === "success" && "text-green-600 dark:text-green-400",
                          tx.status === "pending" && "text-amber-600 dark:text-amber-400",
                          tx.status === "failed" && "text-red-600 dark:text-red-400",
                        )}
                      >
                        <StatusDot status={statusMap[tx.status]} />
                        {statusLabel[tx.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                      {formatAddress(tx.from)} → {formatAddress(tx.to)}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p
                    className={cn(
                      "text-sm font-medium tabular-nums",
                      tx.type === "receive"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-900 dark:text-white",
                    )}
                  >
                    {tx.type === "receive" ? "+" : tx.type === "send" ? "−" : ""}
                    {formatEther(tx.value)} {symbol}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(tx.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
