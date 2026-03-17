"use client";

import React, { useState } from "react";
import { Search, Shield, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { SecurityCheck, SmartContractScannerProps } from "./types";
import { isValidAddress, getMockChecks, getStatusVariant } from "./utils";

export type { SecurityCheck, SmartContractScannerProps };

export function SmartContractScanner({ className, onScan }: SmartContractScannerProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [scanned, setScanned] = useState(false);

  const handleScan = async () => {
    if (!isValidAddress(address)) return;
    setLoading(true);
    onScan?.(address);
    await new Promise((r) => setTimeout(r, 1500));
    setChecks(getMockChecks());
    setScanned(true);
    setLoading(false);
  };

  const score = scanned ? Math.round((checks.filter((c) => c.status === "safe").length / checks.length) * 100) : 0;

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Shield className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contract Scanner</h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Contract address (0x...)" value={address} onChange={(e) => setAddress(e.target.value)} className="font-mono text-xs" />
          <Button onClick={handleScan} disabled={!address || loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {scanned && (
          <>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Security Score</p>
                <p className={cn("text-2xl font-semibold", score >= 80 ? "text-green-600 dark:text-green-400" : score >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400")}>
                  {score}/100
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{checks.length} checks</span>
            </div>

            <div className="space-y-2">
              {checks.map((check) => (
                <div key={check.id} className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150">
                  <Badge variant={getStatusVariant(check.status)} className="mt-0.5">{check.status}</Badge>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{check.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{check.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SmartContractScanner;
