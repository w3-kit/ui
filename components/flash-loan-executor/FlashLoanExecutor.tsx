"use client";

import React, { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Protocol, FlashLoanToken, FlashLoanExecutorProps } from "./types";

export type { Protocol, FlashLoanToken, FlashLoanExecutorProps };

export const FlashLoanExecutor: React.FC<FlashLoanExecutorProps> = ({
  protocols,
  tokens,
  onExecute,
  className,
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [selectedToken, setSelectedToken] = useState<FlashLoanToken | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!selectedProtocol || !selectedToken || !amount) return;
    setLoading(true);
    try {
      await onExecute?.(selectedProtocol.name, selectedToken.symbol, amount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <Zap className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Flash Loan</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Protocol */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Protocol</p>
          <div className="flex gap-2">
            {protocols.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelectedProtocol(p)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors duration-150",
                  selectedProtocol?.name === p.name
                    ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900"
                    : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900",
                )}
              >
                <TokenIcon symbol={p.name} logoURI={p.logoURI} size="sm" />
                <span className="text-gray-900 dark:text-white">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Token */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Token</p>
          <div className="flex gap-2">
            {tokens.map((t) => (
              <button
                key={t.symbol}
                onClick={() => setSelectedToken(t)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors duration-150",
                  selectedToken?.symbol === t.symbol
                    ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900"
                    : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900",
                )}
              >
                <TokenIcon symbol={t.symbol} logoURI={t.logoURI} size="sm" />
                <span className="text-gray-900 dark:text-white">{t.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Amount</p>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button
          onClick={handleExecute}
          disabled={!selectedProtocol || !selectedToken || !amount || loading}
          className="w-full"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Execute Flash Loan"}
        </Button>
      </div>
    </div>
  );
};

export default FlashLoanExecutor;
