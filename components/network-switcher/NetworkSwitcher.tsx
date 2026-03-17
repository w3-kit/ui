"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Network, NetworkSwitcherProps } from "./types";

export type { Network, NetworkSwitcherProps };

export function NetworkSwitcher({
  networks,
  testNetworks = [],
  onSwitch,
  className,
}: NetworkSwitcherProps) {
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [showTestnets, setShowTestnets] = useState(false);

  const displayNetworks = showTestnets ? testNetworks : networks;

  const handleSelect = (chainId: number) => {
    setSelectedChainId(chainId);
    onSwitch(chainId);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Select Network
        </h3>
        {testNetworks.length > 0 && (
          <button
            onClick={() => setShowTestnets(!showTestnets)}
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-150",
              showTestnets
                ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {showTestnets ? "Testnets" : "Mainnets"}
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {displayNetworks.map((network) => {
          const isSelected = selectedChainId === network.chainId;
          return (
            <button
              key={network.chainId}
              onClick={() => handleSelect(network.chainId)}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 text-left transition-colors duration-150",
                isSelected
                  ? "bg-gray-50 dark:bg-gray-900"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <TokenIcon symbol={network.symbol} logoURI={network.logoURI} size="md" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{network.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{network.symbol}</p>
                </div>
              </div>
              {isSelected && <Check className="h-4 w-4 text-green-600 dark:text-green-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default NetworkSwitcher;
