"use client";

import React, { useState } from "react";
import { Search, Loader2, Copy, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ENSResult, ENSResolverProps } from "./types";
import { defaultResolver, truncateAddress } from "./utils";

export type { ENSResult, ENSResolverProps };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function ENSResolver({ onResolve, className, resolver = defaultResolver }: ENSResolverProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ENSResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          ENS Resolver
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="vitalik.eth or 0x..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleResolve()}
            className="font-mono text-xs"
          />
          <Button onClick={handleResolve} disabled={!query || loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Error */}
        {error && <p className="text-[11px] text-red-600 dark:text-red-400">{error}</p>}

        {/* Pre-resolve hint */}
        {!result && !loading && !error && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
            Look up an ENS name to find its address, or enter an address for reverse lookup
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-6 gap-2">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            <p className="text-xs text-gray-500 dark:text-gray-400">Resolving…</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
            {/* Avatar + ENS Name */}
            {result.ensName && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {result.avatar ? (
                    <img src={result.avatar} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      {result.ensName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">ENS Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{result.ensName}</p>
                  </div>
                </div>
                <CopyButton text={result.ensName} />
              </div>
            )}

            {/* Address */}
            {result.address && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">{truncateAddress(result.address)}</p>
                </div>
                <CopyButton text={result.address} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ENSResolver;
