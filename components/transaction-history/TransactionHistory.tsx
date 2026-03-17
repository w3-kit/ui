"use client";

import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "../../lib/utils";
import { StatusDot } from "../ui/status-dot";
import { Transaction, TransactionHistoryProps } from "./types";
import { formatAddress, formatTimestamp, formatEther } from "./utils";

export type { Transaction, TransactionHistoryProps };

const statusMap = {
  success: "success",
  pending: "pending",
  failed: "error",
} as const;

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onTransactionClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Transactions
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {transactions.length} total
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          No transactions yet
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              className={cn(
                "flex items-center justify-between px-4 py-3 transition-colors duration-150",
                onTransactionClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
              onClick={() => onTransactionClick?.(tx)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {tx.from.length > tx.to.length ? (
                    <ArrowUpRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                      {formatAddress(tx.hash)}
                    </p>
                    <StatusDot status={statusMap[tx.status]} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatAddress(tx.from)} → {formatAddress(tx.to)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                  {formatEther(tx.value)} ETH
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(tx.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
