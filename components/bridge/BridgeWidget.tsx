"use client";

import React, { useState } from "react";
import { ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Button } from "../ui/button";
import { Network, BridgeToken, BridgeWidgetProps } from "./types";
import { DEFAULT_NETWORKS, DEFAULT_TOKENS } from "./utils";

export type { Network, BridgeToken, BridgeWidgetProps };

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

  const handleBridge = async () => {
    if (!fromNetwork || !toNetwork || !selectedToken || !amount) return;
    setIsProcessing(true);
    try {
      await onBridge?.({ fromNetwork, toNetwork, token: selectedToken, amount });
    } finally {
      setIsProcessing(false);
    }
  };

  const switchNetworks = () => {
    setFromNetwork(toNetwork);
    setToNetwork(fromNetwork);
  };

  const Selector = ({
    label,
    value,
    items,
    type,
    onSelect,
  }: {
    label: string;
    value: { name: string; icon: string } | null;
    items: { name: string; icon: string; id?: number; symbol?: string }[];
    type: "from" | "to" | "token";
    onSelect: (item: any) => void;
  }) => (
    <div className="relative">
      <button
        onClick={() => setOpenSelector(openSelector === type ? null : type)}
        className="flex items-center justify-between w-full rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900"
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
        <ChevronDown className="h-3 w-3 text-gray-400" />
      </button>
      {openSelector === type && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden shadow-lg">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { onSelect(item); setOpenSelector(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-left transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <TokenIcon symbol={item.name} logoURI={item.icon} size="sm" />
              <span className="text-sm text-gray-900 dark:text-white">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4", className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Bridge</h3>

      {/* Networks */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">From</p>
          <Selector label="Select network" value={fromNetwork} items={networks} type="from" onSelect={setFromNetwork} />
        </div>
        <button
          onClick={switchNetworks}
          className="mb-0.5 w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">To</p>
          <Selector label="Select network" value={toNetwork} items={networks} type="to" onSelect={setToNetwork} />
        </div>
      </div>

      {/* Token */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Token</p>
        <Selector label="Select token" value={selectedToken} items={tokens} type="token" onSelect={setSelectedToken} />
      </div>

      {/* Amount */}
      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3 mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Amount</p>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-transparent text-xl font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none tabular-nums"
        />
      </div>

      <Button
        onClick={handleBridge}
        disabled={!fromNetwork || !toNetwork || !selectedToken || !amount || isProcessing}
        className="w-full"
      >
        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bridge"}
      </Button>
    </div>
  );
}

export default BridgeWidget;
