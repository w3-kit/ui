"use client";

import React from "react";
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  FileCode,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionHistoryProps } from "./types";
import { truncateHash, relativeTime } from "./utils";

const TYPE_CONFIG: Record<
  Transaction["type"],
  { icon: React.ElementType; bg: string; text: string; label: string }
> = {
  send: {
    icon: ArrowUpRight,
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    label: "Sent",
  },
  receive: {
    icon: ArrowDownLeft,
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    label: "Received",
  },
  swap: {
    icon: ArrowLeftRight,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    label: "Swapped",
  },
  approve: {
    icon: ShieldCheck,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400",
    label: "Approved",
  },
  contract: {
    icon: FileCode,
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    label: "Contract",
  },
};

const STATUS_STYLES: Record<Transaction["status"], string> = {
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function TransactionHistory({
  transactions,
  onTransactionClick,
  className,
}: TransactionHistoryProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <History className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Transactions</h3>
      </div>

      {/* Transaction rows */}
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {transactions.map((tx) => {
          const config = TYPE_CONFIG[tx.type];
          const Icon = config.icon;

          return (
            <li
              key={tx.hash}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors",
                onTransactionClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900",
              )}
              onClick={() => onTransactionClick?.(tx)}
            >
              {/* Type icon */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  config.bg,
                )}
              >
                <Icon className={cn("h-4 w-4", config.text)} />
              </div>

              {/* Description + hash */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {config.label}
                </p>
                <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {truncateHash(tx.hash)}
                </p>
              </div>

              {/* Value */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tx.value} {tx.tokenSymbol ?? ""}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {relativeTime(tx.timestamp)}
                </p>
              </div>

              {/* Status badge */}
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                  STATUS_STYLES[tx.status],
                )}
              >
                {tx.status}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2.5 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
