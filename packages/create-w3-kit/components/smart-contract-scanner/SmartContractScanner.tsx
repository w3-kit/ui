"use client";

import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
  Loader2,
} from "lucide-react";

export type CheckStatus = "safe" | "warning" | "danger";

export interface SecurityCheck {
  name: string;
  status: CheckStatus;
  description?: string;
}

export interface SmartContractScannerProps {
  address?: string;
  score?: number;
  checks?: SecurityCheck[];
  onScan?: (address: string) => void;
  loading?: boolean;
  className?: string;
}

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const statusIcon = {
  safe: ShieldCheck,
  warning: ShieldAlert,
  danger: ShieldX,
} as const;

const statusColor = {
  safe: "text-green-600 dark:text-green-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
} as const;

const statusBadge = {
  safe: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
} as const;

function scoreColor(score: number) {
  if (score > 70) return "border-green-500 text-green-600 dark:text-green-400";
  if (score > 40) return "border-amber-500 text-amber-600 dark:text-amber-400";
  return "border-red-500 text-red-600 dark:text-red-400";
}

export function SmartContractScanner({
  address,
  score,
  checks,
  onScan,
  loading = false,
  className = "",
}: SmartContractScannerProps) {
  const [input, setInput] = useState("");
  const hasResults = score !== undefined && checks !== undefined;
  const passedCount = checks?.filter((c) => c.status === "safe").length ?? 0;

  const handleScan = () => {
    const value = input.trim();
    if (value && onScan) onScan(value);
  };

  return (
    <div
      className={`max-w-sm rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Scanner
        </span>
        {address && (
          <span className="ml-auto rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {truncateAddress(address)}
          </span>
        )}
      </div>

      <div className="px-4 pb-4 space-y-4">
        {/* Input state */}
        {!hasResults && !loading && (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="0x..."
              className="flex-1 rounded-lg border border-gray-200 bg-transparent px-3 py-2 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-600 dark:focus:ring-gray-600"
            />
            <button
              onClick={handleScan}
              disabled={!input.trim()}
              className="rounded-lg bg-gray-900 px-3 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}

        {/* Results */}
        {hasResults && !loading && (
          <>
            <div className="flex justify-center py-2">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${scoreColor(score)}`}
              >
                <span className="text-2xl font-bold tabular-nums">{score}</span>
              </div>
            </div>

            <ul className="space-y-1.5">
              {checks.map((check: SecurityCheck) => {
                const Icon = statusIcon[check.status];
                return (
                  <li
                    key={check.name}
                    className="flex items-start gap-2.5 rounded-lg px-2 py-2"
                  >
                    <Icon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${statusColor[check.status]}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {check.name}
                        </span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase leading-none ${statusBadge[check.status]}`}
                        >
                          {check.status}
                        </span>
                      </div>
                      {check.description && (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {check.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Footer */}
      {hasResults && !loading && (
        <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {passedCount} check{passedCount !== 1 ? "s" : ""} passed
          </p>
        </div>
      )}
    </div>
  );
}

export default SmartContractScanner;
