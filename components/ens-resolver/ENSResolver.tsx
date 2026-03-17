"use client";

import React, { useState } from "react";
import { Search, Loader2, Copy, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ENSResult, ENSResolverProps } from "./types";
import { defaultResolver, truncateAddress } from "./utils";

export type { ENSResult, ENSResolverProps };

export function ENSResolver({ onResolve, className, resolver = defaultResolver }: ENSResolverProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ENSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleResolve = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await resolver(query.trim());
      setResult(r);
      onResolve?.(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resolution failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">ENS Resolver</h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Input placeholder="vitalik.eth or 0x..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleResolve()} className="font-mono text-xs" />
          <Button onClick={handleResolve} disabled={!query || loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

        {result && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
            {result.ensName && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ENS Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{result.ensName}</p>
                </div>
              </div>
            )}
            {result.address && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">{truncateAddress(result.address)}</p>
                </div>
                <button onClick={() => handleCopy(result.address!)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ENSResolver;
