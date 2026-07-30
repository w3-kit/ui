"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { explorerAddressUrl, explorerTxUrl } from "../chain-selector/utils";
import type { Chain } from "../chain-selector/types";
import type { DeployResult } from "./types";

export interface ResultCardProps {
  chain: Chain;
  result: DeployResult;
  className?: string;
}

function truncate(value: string, head = 8, tail = 6) {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

function CopyableAddress({ value, ariaLabel }: { value: string; ariaLabel: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      .writeText(value)
      .catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2">
      <code className="font-mono text-sm text-gray-900 dark:text-gray-100" title={value}>
        {truncate(value)}
      </code>
      <button
        type="button"
        onClick={onCopy}
        aria-label={ariaLabel}
        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        {copied ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
}

export function ResultCard({ chain, result, className }: ResultCardProps) {
  const addressUrl = explorerAddressUrl(chain, result.address);
  const txUrl = explorerTxUrl(chain, result.txHash);

  return (
    <section
      aria-label="Deployment result"
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/30",
        className,
      )}
    >
      <header className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
          <Check size={16} className="text-green-600 dark:text-green-400" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
            Token deployed
          </h3>
          <p className="text-xs text-green-700 dark:text-green-300">
            Standard: {chain.ecosystem === "evm" ? "ERC-20" : "SPL"} · Network: {chain.name}
          </p>
        </div>
      </header>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-green-700 dark:text-green-300">
          Token address
        </span>
        <CopyableAddress
          value={result.address}
          ariaLabel={`Copy token address ${result.address}`}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-green-700 dark:text-green-300">
          Tx hash
        </span>
        <div className="flex items-center gap-2">
          <code
            className="font-mono text-sm text-green-900 dark:text-green-100"
            title={result.txHash}
          >
            {truncate(result.txHash)}
          </code>
          {txUrl && (
            <a
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open transaction in explorer"
              className="rounded-md p-1 text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/40"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {addressUrl && (
        <a
          href={addressUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start rounded-lg border border-green-300 px-3 py-1.5 text-xs font-medium text-green-800 hover:bg-green-100 dark:border-green-800 dark:text-green-200 dark:hover:bg-green-900/40"
        >
          View on {chain.explorerHost ?? "explorer"} →
        </a>
      )}
    </section>
  );
}
