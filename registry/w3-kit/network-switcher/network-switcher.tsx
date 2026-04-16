"use client";

import React, { useState, useMemo } from "react";
import { Check, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NetworkSwitcherProps, Network } from "./types";

function NetworkIcon({ network, size = 24 }: { network: Network; size?: number }) {
  if (network.icon) {
    return (
      <img
        src={network.icon}
        alt={network.name}
        width={size}
        height={size}
        className="shrink-0 rounded-full"
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{
        width: size,
        height: size,
        background: network.color ?? "#888",
      }}
    >
      {network.symbol?.slice(0, 2) ?? network.name.slice(0, 2)}
    </span>
  );
}

export function NetworkSwitcher({
  networks,
  activeChainId,
  onSwitch,
  searchable = false,
  showTestnetToggle,
  switchingTo,
  className,
}: NetworkSwitcherProps) {
  const [search, setSearch] = useState("");
  const [showTestnets, setShowTestnets] = useState(false);

  const hasTestnets = useMemo(() => networks.some((n) => n.testnet), [networks]);

  const shouldShowToggle = showTestnetToggle ?? hasTestnets;

  const filtered = useMemo(() => {
    let list = networks;

    if (shouldShowToggle) {
      list = list.filter((n) => (showTestnets ? n.testnet : !n.testnet));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.chainId.toString().includes(q) ||
          n.symbol?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [networks, showTestnets, shouldShowToggle, search]);

  const activeNetwork = networks.find((n) => n.chainId === activeChainId);

  const handleSwitch = (chainId: number) => {
    if (chainId === activeChainId) return;
    onSwitch(chainId);
  };

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
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Network</span>
          {activeNetwork && (
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{activeNetwork.name}</span>
            </div>
          )}
        </div>
        {shouldShowToggle && (
          <button
            onClick={() => setShowTestnets(!showTestnets)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              showTestnets
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "border border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600",
            )}
          >
            Testnets
          </button>
        )}
      </div>

      {/* Search */}
      {searchable && (
        <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search networks..."
              className={cn(
                "w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-8 pr-8 text-sm text-gray-900 placeholder:text-gray-400",
                "focus:border-gray-300 focus:outline-none dark:border-gray-700 dark:text-gray-100 dark:focus:border-gray-600",
              )}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Network list */}
      <div className="flex flex-col gap-0.5 p-2">
        {filtered.map((network) => {
          const isActive = network.chainId === activeChainId;
          const isSwitching = network.chainId === switchingTo;

          return (
            <button
              key={network.chainId}
              onClick={() => handleSwitch(network.chainId)}
              disabled={!!switchingTo}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                isActive
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                switchingTo && !isSwitching && "opacity-40",
              )}
            >
              <NetworkIcon network={network} size={28} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {network.name}
                </span>
              </div>
              <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
                {network.chainId}
              </span>
              {isSwitching ? (
                <Loader2 size={14} className="shrink-0 animate-spin text-gray-400" />
              ) : isActive ? (
                <Check size={14} className="shrink-0 text-gray-900 dark:text-gray-100" />
              ) : null}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            No networks found
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} network{filtered.length !== 1 ? "s" : ""}
          {shouldShowToggle && (showTestnets ? " (testnets)" : " (mainnets)")}
        </span>
      </div>
    </div>
  );
}

export default NetworkSwitcher;
