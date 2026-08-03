"use client";

import React, { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Chain, ChainSelectorProps } from "./types";

function ChainIcon({ chain, size = 28 }: { chain: Chain; size?: number }) {
  if (chain.icon) {
    if (typeof chain.icon === "string") {
      return (
        <img
          src={chain.icon}
          alt={chain.name}
          width={size}
          height={size}
          className="shrink-0 rounded-full"
        />
      );
    }
    return <span className="shrink-0">{chain.icon}</span>;
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ width: size, height: size, background: chain.color ?? "#888" }}
      aria-hidden="true"
    >
      {chain.symbol?.slice(0, 2) ?? chain.name.slice(0, 2)}
    </span>
  );
}

export function ChainSelector({
  chains,
  selectedChainId,
  onSelect,
  searchable = false,
  showTestnetToggle,
  className,
}: ChainSelectorProps) {
  const [search, setSearch] = useState("");
  const [showTestnets, setShowTestnets] = useState(false);

  const hasTestnets = useMemo(() => chains.some((c) => c.testnet), [chains]);
  // `shouldShowToggle` only controls whether the toggle BUTTON is rendered.
  // The filter must always apply when testnets exist, otherwise hiding the
  // button via `showTestnetToggle={false}` would silently surface testnets
  // with no way to hide them.
  const shouldShowToggle = showTestnetToggle ?? hasTestnets;
  const filterTestnets = hasTestnets && !showTestnets;

  const filtered = useMemo(() => {
    let list = chains;
    if (filterTestnets) {
      list = list.filter((c) => !c.testnet);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol?.toLowerCase().includes(q) ||
          c.currency?.toLowerCase().includes(q) ||
          c.chainId.toString().includes(q),
      );
    }
    return list;
  }, [chains, search, filterTestnets]);

  const grouped = useMemo(() => {
    const evm = filtered.filter((c) => c.ecosystem === "evm");
    const sol = filtered.filter((c) => c.ecosystem === "solana");
    return { evm, sol };
  }, [filtered]);

  // Flat list in DOM order so keyboard navigation is deterministic.
  const flatChains = useMemo(
    () => [...grouped.evm, ...grouped.sol],
    [grouped.evm, grouped.sol],
  );

  // Focused index for roving tabindex. Defaults to the selected chain, or 0.
  const [focusIndex, setFocusIndex] = useState(() => {
    const idx = flatChains.findIndex(
      (c) => String(c.chainId) === String(selectedChainId ?? ""),
    );
    return idx === -1 ? 0 : idx;
  });

  // Keep focusIndex valid when the chain list shrinks (e.g. user filters).
  useMemo(() => {
    if (focusIndex >= flatChains.length) setFocusIndex(0);
  }, [flatChains.length, focusIndex]);

  const focusChainAt = (idx: number) => {
    const wrapped = (idx + flatChains.length) % flatChains.length;
    setFocusIndex(wrapped);
    const el = document.querySelector<HTMLElement>(
      `[data-chain-radio="${flatChains[wrapped].chainId}"]`,
    );
    el?.focus();
  };

  const handleSelect = (chainId: number | string) => {
    if (String(chainId) === String(selectedChainId ?? "")) return;
    onSelect(chainId);
  };

  const renderRow = (chain: Chain, isFocused: boolean) => {
    const isSelected = String(chain.chainId) === String(selectedChainId ?? "");
    return (
      <div
        key={chain.chainId.toString()}
        role="radio"
        tabIndex={isFocused ? 0 : -1}
        aria-checked={isSelected}
        aria-label={chain.name}
        data-chain-radio={chain.chainId}
        onClick={() => handleSelect(chain.chainId)}
        onKeyDown={(e) => {
          // ArrowDown / ArrowRight: next row.
          // ArrowUp / ArrowLeft: previous row (with wrap-around).
          // Home / End: jump to ends. Enter / Space: select.
          switch (e.key) {
            case "ArrowDown":
            case "ArrowRight": {
              e.preventDefault();
              const i = flatChains.findIndex((c) => c.chainId === chain.chainId);
              focusChainAt(i + 1);
              break;
            }
            case "ArrowUp":
            case "ArrowLeft": {
              e.preventDefault();
              const i = flatChains.findIndex((c) => c.chainId === chain.chainId);
              focusChainAt(i - 1);
              break;
            }
            case "Home":
              e.preventDefault();
              focusChainAt(0);
              break;
            case "End":
              e.preventDefault();
              focusChainAt(flatChains.length - 1);
              break;
            case "Enter":
            case " ":
            case "Spacebar":
              e.preventDefault();
              handleSelect(chain.chainId);
              break;
            default:
          }
        }}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700",
          isSelected
            ? "bg-gray-100 dark:bg-gray-800"
            : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
        )}
      >
        <ChainIcon chain={chain} />
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
            {chain.name}
          </span>
          {chain.currency && (
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              {chain.currency}
              {chain.testnet && (
                <span className="ml-1.5 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase dark:bg-gray-800 dark:text-gray-400">
                  testnet
                </span>
              )}
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
          {chain.chainId}
        </span>
        {isSelected && (
          <Check size={14} className="shrink-0 text-gray-900 dark:text-gray-100" />
        )}
      </div>
    );
  };

  return (
    <div
      role="radiogroup"
      aria-label="Select a chain"
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Choose a chain
        </span>
        {shouldShowToggle && (
          <button
            type="button"
            onClick={() => setShowTestnets((v) => !v)}
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
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chains..."
              aria-label="Search chains"
              className={cn(
                "w-full rounded-lg border border-gray-200 bg-transparent py-2 pl-8 pr-8 text-sm text-gray-900 placeholder:text-gray-400",
                "focus:border-gray-300 focus:outline-none dark:border-gray-700 dark:text-gray-100 dark:focus:border-gray-600",
              )}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chain groups */}
      <div className="flex flex-col gap-1 p-2">
        {grouped.evm.length > 0 && (
          <section aria-labelledby="chain-selector-evm">
            <p
              id="chain-selector-evm"
              className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500"
            >
              EVM
            </p>
            <div className="flex flex-col gap-0.5">
              {grouped.evm.map((c) => {
                const i = flatChains.findIndex((x) => x.chainId === c.chainId);
                return renderRow(c, i === focusIndex);
              })}
            </div>
          </section>
        )}
        {grouped.sol.length > 0 && (
          <section aria-labelledby="chain-selector-solana">
            <p
              id="chain-selector-solana"
              className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500"
            >
              Solana
            </p>
            <div className="flex flex-col gap-0.5">
              {grouped.sol.map((c) => {
                const i = flatChains.findIndex((x) => x.chainId === c.chainId);
                return renderRow(c, i === focusIndex);
              })}
            </div>
          </section>
        )}
        {filtered.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            No chains found
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} chain{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default ChainSelector;
