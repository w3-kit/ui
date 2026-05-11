"use client";

import React, { useState } from "react";
import { Shield, Check, X, Plus, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MultisigWalletProps } from "./types";
import { formatAddress, timeAgo } from "./utils";

const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  executed: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  rejected: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
} as const;

export function MultisigWallet({
  walletAddress,
  signers,
  transactions,
  requiredApprovals,
  onApprove,
  onReject,
  onPropose,
  approvingId,
  className,
}: MultisigWalletProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"pending" | "executed" | "all">("pending");

  const filtered = transactions
    .filter((tx) => tab === "all" || tx.status === tab)
    .sort((a, b) => b.timestamp - a.timestamp);

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <Shield size={18} className="text-gray-900 dark:text-gray-100" />
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Multisig</span>
          <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {requiredApprovals}/{signers.length}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-xs text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {formatAddress(walletAddress)}
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
        </button>
      </div>

      {/* Signers */}
      <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Signers
          </p>
          <div className="flex -space-x-2">
            {signers.map((s) => (
              <div
                key={s.address}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950"
                title={s.name || formatAddress(s.address)}
              >
                {(s.name?.[0] || "S").toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + Propose */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-2.5 dark:border-gray-800">
        <div className="flex gap-1">
          {(["pending", "executed", "all"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition-colors",
                tab === t
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800",
              )}
            >
              {t}
              {t === "pending" && pendingCount > 0 && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-1.5 text-[10px]",
                    tab === t
                      ? "bg-white/20 dark:bg-gray-900/20"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
                  )}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        {onPropose && (
          <button
            onClick={onPropose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Transactions */}
      <div className="flex flex-col gap-0.5 p-2">
        {filtered.map((tx) => (
          <div
            key={tx.id}
            className="rounded-xl px-3 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tx.description}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {tx.value} ETH → {formatAddress(tx.to)} · {timeAgo(tx.timestamp)}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium capitalize",
                  STATUS_STYLES[tx.status],
                )}
              >
                {tx.status}
              </span>
            </div>

            {/* Progress */}
            <div className="mt-2.5 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    tx.status === "executed"
                      ? "bg-green-500"
                      : tx.status === "rejected"
                        ? "bg-red-500"
                        : "bg-gray-900 dark:bg-gray-100",
                  )}
                  style={{
                    width: `${Math.min((tx.approvals / tx.requiredApprovals) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="shrink-0 font-mono text-xs text-gray-500 dark:text-gray-400">
                {tx.approvals}/{tx.requiredApprovals}
              </span>
            </div>

            {/* Actions */}
            {tx.status === "pending" && (onApprove || onReject) && (
              <div className="mt-2.5 flex gap-2">
                {onApprove && (
                  <button
                    onClick={() => onApprove(tx.id)}
                    disabled={approvingId === tx.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  >
                    {approvingId === tx.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                    Approve
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => onReject(tx.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    <X size={12} />
                    Reject
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            No {tab === "all" ? "" : tab} transactions
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} ·{" "}
          {requiredApprovals} of {signers.length} required
        </span>
      </div>
    </div>
  );
}

export default MultisigWallet;
