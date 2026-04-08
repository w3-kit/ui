"use client";

import React from "react";
import { Check, X, FileText } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { StatusDot } from "../ui/status-dot";
import { MultisigWalletProps } from "./types";
import { formatAddress, formatTimestamp } from "./utils";

export type { MultisigWalletProps };
export type { Signer, Transaction } from "./types";

const statusMap = { pending: "pending", executed: "success", rejected: "error" } as const;
const statusVariant = { pending: "warning", executed: "success", rejected: "error" } as const;
const statusLabel = { pending: "Pending", executed: "Executed", rejected: "Rejected" };

export const MultisigWallet: React.FC<MultisigWalletProps> = ({
  walletAddress,
  signers,
  transactions,
  requiredApprovals,
  onApprove,
  onReject,
  className,
}) => {
  const pendingCount = transactions.filter((tx) => tx.status === "pending").length;

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
            Multisig Wallet
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {formatAddress(walletAddress)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {requiredApprovals} of {signers.length} required
          </span>
          <div className="flex -space-x-1">
            {signers.slice(0, 3).map((s, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-950 flex items-center justify-center text-[8px] font-medium text-gray-600 dark:text-gray-300"
              >
                {(s.name || s.address).charAt(0).toUpperCase()}
              </div>
            ))}
            {signers.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 border border-white dark:border-gray-950 flex items-center justify-center text-[8px] font-medium text-gray-500 dark:text-gray-400">
                +{signers.length - 3}
              </div>
            )}
          </div>
          {pendingCount > 0 && (
            <span className="ml-auto flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <StatusDot status="pending" />
              {pendingCount} pending
            </span>
          )}
        </div>
      </div>

      {/* Transactions */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <FileText className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No transactions</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Proposed transactions will appear here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="px-4 py-3 space-y-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusDot status={statusMap[tx.status]} />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {tx.description || "Transaction"}
                  </p>
                  <Badge variant={statusVariant[tx.status]}>{statusLabel[tx.status]}</Badge>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(tx.timestamp)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  To: <span className="font-mono">{formatAddress(tx.to)}</span> ·{" "}
                  <span className="tabular-nums">{tx.value} ETH</span>
                  {tx.proposer && (
                    <>
                      {" "}
                      · by <span className="font-mono">{formatAddress(tx.proposer)}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                    {tx.approvals}/{tx.requiredApprovals}
                  </span>
                  <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        tx.approvals >= tx.requiredApprovals ? "bg-green-500" : "bg-amber-500",
                      )}
                      style={{
                        width: `${Math.min((tx.approvals / tx.requiredApprovals) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              {tx.status === "pending" && (onApprove || onReject) && (
                <div className="flex gap-2 pt-1">
                  {onApprove && (
                    <Button onClick={() => onApprove(tx.id)} size="sm" className="h-7 text-xs">
                      <Check className="h-3 w-3" /> Approve
                    </Button>
                  )}
                  {onReject && (
                    <Button
                      onClick={() => onReject(tx.id)}
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                    >
                      <X className="h-3 w-3" /> Reject
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultisigWallet;
