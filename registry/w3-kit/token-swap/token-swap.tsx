"use client";

import React, { useState } from "react";
import { ArrowDownUp, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SwapToken, TokenSwapProps } from "./types";
import { formatRate } from "./utils";

function TokenSelector({
  token,
  tokens,
  onSelect,
  open,
  onToggle,
}: {
  token?: SwapToken;
  tokens: SwapToken[];
  onSelect: (t: SwapToken) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        {token?.icon && (
          <img src={token.icon} alt={token.symbol} className="h-5 w-5 rounded-full object-contain" />
        )}
        <span>{token?.symbol ?? "Select"}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950">
          {tokens.map((t) => (
            <button
              key={t.symbol}
              type="button"
              onClick={() => onSelect(t)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                t.symbol === token?.symbol && "bg-gray-100 dark:bg-gray-800",
              )}
            >
              {t.icon && (
                <img src={t.icon} alt={t.symbol} className="h-5 w-5 rounded-full object-contain" />
              )}
              <span className="font-medium">{t.symbol}</span>
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TokenSwap({
  tokens,
  fromToken,
  toToken,
  onSwap,
  onFromTokenChange,
  onToTokenChange,
  exchangeRate,
  slippage,
  loading = false,
  className,
}: TokenSwapProps) {
  const [fromAmount, setFromAmount] = useState("");
  const [openSelector, setOpenSelector] = useState<"from" | "to" | null>(null);

  const toAmount =
    fromAmount && exchangeRate ? (parseFloat(fromAmount) * exchangeRate).toFixed(6) : "";

  const handleFlip = () => {
    if (!fromToken || !toToken) return;
    onFromTokenChange?.(toToken);
    onToTokenChange?.(fromToken);
    setFromAmount("");
  };

  const handleSwap = () => {
    if (!fromToken || !toToken || !fromAmount) return;
    onSwap({ from: fromToken, to: toToken, amount: fromAmount });
  };

  const canSwap = !!fromToken && !!toToken && !!fromAmount && !loading;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <ArrowDownUp className="h-5 w-5" />
        <h2 className="text-base font-semibold">Swap</h2>
        {slippage !== undefined && (
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            Slippage {slippage}%
          </span>
        )}
      </div>

      {/* From */}
      <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
          {fromToken?.balance && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Balance: {fromToken.balance}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.0"
            value={fromAmount}
            onChange={(e) => {
              if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
                setFromAmount(e.target.value);
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          <TokenSelector
            token={fromToken}
            tokens={tokens}
            open={openSelector === "from"}
            onToggle={() => setOpenSelector(openSelector === "from" ? null : "from")}
            onSelect={(t) => {
              onFromTokenChange?.(t);
              setOpenSelector(null);
            }}
          />
        </div>
      </div>

      {/* Flip */}
      <div className="relative z-[1] -my-2 flex justify-center">
        <button
          type="button"
          onClick={handleFlip}
          disabled={!fromToken || !toToken}
          className="rounded-full border-4 border-white bg-gray-100 p-1.5 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:border-gray-950 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <ArrowDownUp className="h-4 w-4" />
        </button>
      </div>

      {/* To */}
      <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">To</span>
          {toToken?.balance && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Balance: {toToken.balance}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="0.0"
            value={toAmount}
            readOnly
            className="min-w-0 flex-1 bg-transparent text-xl font-medium outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
          <TokenSelector
            token={toToken}
            tokens={tokens}
            open={openSelector === "to"}
            onToggle={() => setOpenSelector(openSelector === "to" ? null : "to")}
            onSelect={(t) => {
              onToTokenChange?.(t);
              setOpenSelector(null);
            }}
          />
        </div>
      </div>

      {/* Rate */}
      {fromToken && toToken && exchangeRate !== undefined && (
        <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
          {formatRate(exchangeRate, fromToken.symbol, toToken.symbol)}
        </p>
      )}

      {/* Swap button */}
      <button
        type="button"
        onClick={handleSwap}
        disabled={!canSwap}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Swapping...
          </>
        ) : (
          "Swap"
        )}
      </button>
    </div>
  );
}

export default TokenSwap;
