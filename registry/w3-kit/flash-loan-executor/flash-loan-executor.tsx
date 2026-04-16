"use client";

import React, { useState, useMemo } from "react";
import { Zap, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FlashLoanProtocol, FlashLoanToken, FlashLoanExecutorProps } from "./types";

export const FlashLoanExecutor: React.FC<FlashLoanExecutorProps> = ({
  protocols,
  tokens,
  selectedProtocol: controlledProtocol,
  selectedToken: controlledToken,
  onExecute,
  onProtocolChange,
  onTokenChange,
  loading = false,
  className,
}) => {
  const [internalProtocol, setInternalProtocol] = useState<FlashLoanProtocol>(protocols[0]);
  const [internalToken, setInternalToken] = useState<FlashLoanToken>(tokens[0]);
  const [amount, setAmount] = useState("");
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  const protocol = controlledProtocol ?? internalProtocol;
  const token = controlledToken ?? internalToken;

  const fee = useMemo(() => {
    const val = parseFloat(amount || "0");
    return val > 0 ? (val * protocol.fee).toFixed(4) : "0.00";
  }, [amount, protocol.fee]);

  const handleProtocol = (p: FlashLoanProtocol) => {
    setInternalProtocol(p);
    onProtocolChange?.(p);
  };

  const handleToken = (t: FlashLoanToken) => {
    setInternalToken(t);
    onTokenChange?.(t);
    setShowTokenDropdown(false);
  };

  const handleExecute = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    onExecute?.({ protocol, token, amount });
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <Zap className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Flash Loan</span>
      </div>

      <div className="space-y-4 p-4">
        {/* Protocol selector */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Protocol
          </label>
          <div className="flex gap-2">
            {protocols.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProtocol(p)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  protocol.id === p.id
                    ? "border-gray-900 bg-gray-50 text-gray-900 dark:border-gray-100 dark:bg-gray-900 dark:text-gray-100"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700",
                )}
              >
                {p.icon && <img src={p.icon} alt={p.name} className="h-5 w-5 rounded-full" />}
                {p.name}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {(p.fee * 100).toFixed(2)}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Token selector + amount */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Token & Amount
          </label>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 p-3">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-gray-900 placeholder-gray-400 outline-none tabular-nums dark:text-gray-100 dark:placeholder-gray-600"
              />
              <div className="relative">
                <button
                  onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  {token.icon && (
                    <img src={token.icon} alt={token.symbol} className="h-4 w-4 rounded-full" />
                  )}
                  {token.symbol}
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>
                {showTokenDropdown && (
                  <div className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-950">
                    {tokens.map((t) => (
                      <button
                        key={t.symbol}
                        onClick={() => handleToken(t)}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900",
                          token.symbol === t.symbol && "bg-gray-50 dark:bg-gray-900",
                        )}
                      >
                        {t.icon && (
                          <img src={t.icon} alt={t.symbol} className="h-4 w-4 rounded-full" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {t.symbol}
                        </span>
                        <span className="text-xs text-gray-500">{t.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fee display */}
            <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2 dark:border-gray-800/50">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Fee ({(protocol.fee * 100).toFixed(2)}%)
              </span>
              <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
                {fee} {token.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Execute button */}
        <button
          onClick={handleExecute}
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-colors",
            loading || !amount || parseFloat(amount) <= 0
              ? "cursor-not-allowed bg-gray-300 dark:bg-gray-700"
              : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
          )}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {loading ? "Executing..." : "Execute Flash Loan"}
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-2.5 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Loan is repaid within the same transaction
        </span>
      </div>
    </div>
  );
};

export default FlashLoanExecutor;
