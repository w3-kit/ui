"use client";

import React, { useState } from "react";
import { ArrowDownUp, AtSign, Copy, Check, ExternalLink, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ENSResolverProps, ENSResult } from "./types";
import { truncateAddress } from "./utils";

export function ENSResolver({
  onResolve,
  resolver,
  suggestions,
  explorerUrl = "https://etherscan.io/address/",
  idleCaption = "Enter a name or address",
  className,
}: ENSResolverProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ENSResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleResolve(query?: string) {
    const value = (query ?? input).trim();
    if (!value || !resolver) return;

    setInput(value);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await resolver(value);
      setResult(res);
      onResolve?.(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleReset() {
    setInput("");
    setResult(null);
    setError(null);
  }

  const footerText = result
    ? "Resolved on Ethereum"
    : isLoading
      ? "Looking up..."
      : error
        ? "Lookup failed"
        : idleCaption;

  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <AtSign size={18} className="text-gray-900 dark:text-gray-100" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">ENS Resolver</h3>
        </div>
        {result && (
          <button
            onClick={handleReset}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            New lookup
          </button>
        )}
      </div>

      {/* Search / idle */}
      {!result && (
        <div className="space-y-3 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Lookup
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleResolve()}
                placeholder="ENS name or 0x address"
                className={cn(
                  "w-full rounded-xl border bg-gray-50 py-2.5 pl-9 pr-3 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500",
                  error
                    ? "border-red-300 focus:ring-red-300 dark:border-red-700 dark:focus:ring-red-800"
                    : "border-gray-200 focus:ring-gray-300 dark:border-gray-700 dark:focus:ring-gray-600",
                )}
              />
            </div>
            <button
              onClick={() => handleResolve()}
              disabled={isLoading || !input.trim()}
              className={cn(
                "flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
                (isLoading || !input.trim()) && "cursor-not-allowed opacity-50",
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  Resolve
                </>
              )}
            </button>
          </div>

          {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}

          {!input && !isLoading && suggestions && suggestions.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs text-gray-500 dark:text-gray-400">Try:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleResolve(s)}
                    className="rounded-lg border border-gray-200 px-2.5 py-1 font-mono text-xs text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && !result && (
        <div className="flex flex-col items-center gap-3 px-5 pb-5">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400 dark:text-gray-500" />
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{input}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-2 px-5 py-4">
          {/* ENS Name block */}
          {result.ensName && (
            <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-3.5 py-3 dark:bg-gray-800/60">
              {result.avatar ? (
                <img
                  src={result.avatar}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full bg-gray-200 object-cover dark:bg-gray-700"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-base font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  {result.ensName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  ENS Name
                </p>
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {result.ensName}
                </p>
              </div>
              <button
                onClick={() => handleCopy(result.ensName!, "ens")}
                className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-200"
                title="Copy ENS name"
              >
                {copied === "ens" ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          )}

          {result.ensName && result.address && (
            <div className="flex justify-center" aria-hidden="true">
              <ArrowDownUp size={14} className="text-gray-400 dark:text-gray-500" />
            </div>
          )}

          {/* Address block */}
          {result.address && (
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-3.5 py-3 dark:bg-gray-900">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Address
                </p>
                <p
                  className="break-all font-mono text-xs text-gray-900 dark:text-gray-100"
                  title={result.address}
                >
                  {result.ensName ? result.address : truncateAddress(result.address)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  onClick={() => handleCopy(result.address!, "address")}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  title="Copy address"
                >
                  {copied === "address" ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                {explorerUrl && (
                  <a
                    href={`${explorerUrl}${result.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    title="View on explorer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">{footerText}</span>
      </div>
    </div>
  );
}

export default ENSResolver;
