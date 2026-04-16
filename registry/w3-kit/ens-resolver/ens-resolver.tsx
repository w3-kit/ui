"use client";

import React, { useState } from "react";
import { AtSign, Copy, Check, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ENSResolverProps, ENSResult } from "./types";
import { truncateAddress } from "./utils";

export function ENSResolver({ onResolve, resolver, className }: ENSResolverProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ENSResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleResolve() {
    if (!input.trim() || !resolver) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await resolver(input.trim());
      setResult(res);
      onResolve?.(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <AtSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">ENS</h3>
      </div>

      {/* Search */}
      <div className="space-y-3 px-5 pb-5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResolve()}
              placeholder="vitalik.eth or 0x..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-gray-600"
            />
          </div>
          <button
            onClick={handleResolve}
            disabled={isLoading || !input.trim()}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
              (isLoading || !input.trim()) && "cursor-not-allowed opacity-50",
            )}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resolve"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Result card */}
        {result && (
          <div className="rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              {result.avatar && (
                <img
                  src={result.avatar}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full bg-gray-200 object-cover dark:bg-gray-700"
                />
              )}
              <div className="min-w-0 flex-1 space-y-1">
                {result.ensName && (
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {result.ensName}
                    </p>
                    <button
                      onClick={() => handleCopy(result.ensName!, "ens")}
                      className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {copied === "ens" ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}
                {result.address && (
                  <div className="flex items-center gap-2">
                    <p className="truncate font-mono text-xs text-gray-500 dark:text-gray-400">
                      {truncateAddress(result.address)}
                    </p>
                    <button
                      onClick={() => handleCopy(result.address!, "address")}
                      className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {copied === "address" ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
