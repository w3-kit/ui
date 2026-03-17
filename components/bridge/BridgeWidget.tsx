"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Button } from "../ui/button";
import { Network, BridgeToken, BridgeWidgetProps } from "./types";
import { DEFAULT_NETWORKS, DEFAULT_TOKENS } from "./utils";

export type { Network, BridgeToken, BridgeWidgetProps };

function SelectorDropdown({
  label,
  value,
  items,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  value: { name: string; icon: string } | null;
  items: { name: string; icon: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (item: any) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      >
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <TokenIcon symbol={value.name} logoURI={value.icon} size="sm" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{value.name}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">{label}</span>
          )}
        </div>
        <ChevronDown className={cn("h-3 w-3 text-gray-400 transition-transform duration-150", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((item, i) => {
            const isSelected = value?.name === item.name;
            return (
              <button
                key={i}
                onClick={() => onSelect(item)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 text-left transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-inset",
                  isSelected && "bg-gray-50 dark:bg-gray-900"
                )}
              >
                <TokenIcon symbol={item.name} logoURI={item.icon} size="sm" />
                <span className="text-sm text-gray-900 dark:text-white flex-1">{item.name}</span>
                {isSelected && <span className="text-[10px] text-gray-400 dark:text-gray-500">Selected</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function BridgeWidget({
  className,
  networks = DEFAULT_NETWORKS,
  tokens = DEFAULT_TOKENS,
  onBridge,
}: BridgeWidgetProps) {
  const [fromNetwork, setFromNetwork] = useState<Network | null>(null);
  const [toNetwork, setToNetwork] = useState<Network | null>(null);
  const [selectedToken, setSelectedToken] = useState<BridgeToken | null>(null);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [openSelector, setOpenSelector] = useState<"from" | "to" | "token" | null>(null);

  const handleBridge = useCallback(async () => {
    if (!fromNetwork || !toNetwork || !selectedToken || !amount) return;
    setIsProcessing(true);
    try {
      await onBridge?.({ fromNetwork, toNetwork, token: selectedToken, amount });
    } finally {
      setIsProcessing(false);
    }
  }, [fromNetwork, toNetwork, selectedToken, amount, onBridge]);

  const switchNetworks = useCallback(() => {
    setFromNetwork(toNetwork);
    setToNetwork(fromNetwork);
  }, [fromNetwork, toNetwork]);

  const handleFromSelect = useCallback((network: Network) => {
    if (network.id === toNetwork?.id) setToNetwork(fromNetwork);
    setFromNetwork(network);
    setOpenSelector(null);
  }, [fromNetwork, toNetwork]);

  const handleToSelect = useCallback((network: Network) => {
    if (network.id === fromNetwork?.id) setFromNetwork(toNetwork);
    setToNetwork(network);
    setOpenSelector(null);
  }, [fromNetwork, toNetwork]);

  const handleTokenSelect = useCallback((token: BridgeToken) => {
    setSelectedToken(token);
    setOpenSelector(null);
  }, []);

  const isSameNetwork = fromNetwork && toNetwork && fromNetwork.id === toNetwork.id;

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          Bridge
        </p>
      </div>

      <div className="p-4">
        {/* Networks */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500 mb-1.5">From</p>
            <SelectorDropdown
              label="Select network"
              value={fromNetwork}
              items={networks}
              isOpen={openSelector === "from"}
              onToggle={() => setOpenSelector(openSelector === "from" ? null : "from")}
              onSelect={handleFromSelect}
            />
          </div>
          <button
            onClick={switchNetworks}
            aria-label="Switch networks"
            className="mb-0.5 w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500 mb-1.5">To</p>
            <SelectorDropdown
              label="Select network"
              value={toNetwork}
              items={networks}
              isOpen={openSelector === "to"}
              onToggle={() => setOpenSelector(openSelector === "to" ? null : "to")}
              onSelect={handleToSelect}
            />
          </div>
        </div>

        {/* Token */}
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500 mb-1.5">Token</p>
          <SelectorDropdown
            label="Select token"
            value={selectedToken}
            items={tokens}
            isOpen={openSelector === "token"}
            onToggle={() => setOpenSelector(openSelector === "token" ? null : "token")}
            onSelect={handleTokenSelect}
          />
        </div>

        {/* Amount */}
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3 mb-4">
          <p className="text-[11px] uppercase tracking-wider font-medium text-gray-400 dark:text-gray-500 mb-2">Amount</p>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-xl font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none focus-visible:outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Same network warning */}
        {isSameNetwork && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mb-3">
            Source and destination networks must be different
          </p>
        )}

        <Button
          onClick={handleBridge}
          disabled={!fromNetwork || !toNetwork || !selectedToken || !amount || isProcessing || !!isSameNetwork}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Bridging…
            </>
          ) : (
            "Bridge"
          )}
        </Button>
      </div>
    </div>
  );
}

export default BridgeWidget;
