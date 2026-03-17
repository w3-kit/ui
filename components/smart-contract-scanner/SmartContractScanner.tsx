"use client";

import React, { useState } from "react";
import { Search, Loader2, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SecurityCheck, SmartContractScannerProps } from "./types";
import { isValidAddress, getMockChecks } from "./utils";

export type { SecurityCheck, SmartContractScannerProps };

const statusConfig = {
  safe: { icon: ShieldCheck, label: "Safe", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950", bar: "bg-green-500" },
  warning: { icon: ShieldAlert, label: "Warning", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950", bar: "bg-amber-500" },
  danger: { icon: ShieldX, label: "Danger", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950", bar: "bg-red-500" },
};

export function SmartContractScanner({ className, onScan }: SmartContractScannerProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [scanned, setScanned] = useState(false);
  const [touched, setTouched] = useState(false);

  const isValid = isValidAddress(address);
  const showError = touched && address.length > 0 && !isValid;

  const handleScan = async () => {
    if (!isValid) return;
    setLoading(true);
    onScan?.(address);
    await new Promise((r) => setTimeout(r, 1500));
    setChecks(getMockChecks());
    setScanned(true);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && !loading) handleScan();
  };

  const score = scanned ? Math.round((checks.filter((c) => c.status === "safe").length / checks.length) * 100) : 0;
  const safeCount = checks.filter((c) => c.status === "safe").length;
  const warnCount = checks.filter((c) => c.status === "warning").length;
  const dangerCount = checks.filter((c) => c.status === "danger").length;

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          Contract Scanner
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <div>
          <div className="flex gap-2">
            <Input
              placeholder="Contract address (0x...)"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setTouched(true); }}
              onKeyDown={handleKeyDown}
              className={cn("font-mono text-xs", showError && "border-red-300 dark:border-red-800")}
            />
            <Button onClick={handleScan} disabled={!isValid || loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          {showError && (
            <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">
              Enter a valid Ethereum address (0x + 40 hex characters)
            </p>
          )}
        </div>

        {/* Pre-scan hint */}
        {!scanned && !loading && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
            Enter a contract address to analyze its security, ownership, and potential risks
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center py-6 gap-2">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Analyzing contract…</p>
          </div>
        )}

        {/* Results */}
        {scanned && !loading && (
          <>
            {/* Score */}
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
                  Security Score
                </p>
                <div className="flex items-center gap-2 text-[11px]">
                  {safeCount > 0 && <span className="text-green-600 dark:text-green-400">{safeCount} safe</span>}
                  {warnCount > 0 && <span className="text-amber-600 dark:text-amber-400">{warnCount} warning</span>}
                  {dangerCount > 0 && <span className="text-red-600 dark:text-red-400">{dangerCount} danger</span>}
                </div>
              </div>
              <p className={cn(
                "text-2xl font-semibold tabular-nums",
                score >= 80 ? "text-green-600 dark:text-green-400" : score >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
              )}>
                {score}/100
              </p>
              {/* Score bar */}
              <div className="flex h-1.5 rounded-full overflow-hidden mt-2 bg-gray-200 dark:bg-gray-800">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Checks list */}
            <div className="space-y-1">
              {checks.map((check) => {
                const config = statusConfig[check.status];
                const Icon = config.icon;
                return (
                  <div key={check.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150">
                    <div className={cn("flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5", config.bg)}>
                      <Icon className={cn("h-3.5 w-3.5", config.color)} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{check.name}</p>
                        <span className={cn("text-[10px] font-medium uppercase tracking-wider", config.color)}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{check.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SmartContractScanner;
