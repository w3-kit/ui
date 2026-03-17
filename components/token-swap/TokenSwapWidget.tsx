"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpDown, Loader2, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Button } from "../ui/button";
import { Token, TokenSwapWidgetProps } from "./types";
import { defaultTokens, getMockExchangeRate } from "./utils";

export type { Token, TokenSwapWidgetProps };

export function TokenSwapWidget({
  onSwap,
  tokens = defaultTokens,
  className,
}: TokenSwapWidgetProps) {
  const [fromToken, setFromToken] = useState<Token | undefined>(tokens[0]);
  const [toToken, setToToken] = useState<Token | undefined>(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState<"from" | "to" | null>(null);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const rate = getMockExchangeRate(fromToken.symbol, toToken.symbol);
      setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
    } else {
      setToAmount("");
    }
  }, [fromToken, toToken, fromAmount]);

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) return;
    setLoading(true);
    try {
      await onSwap(fromToken.symbol, toToken.symbol, fromAmount);
    } finally {
      setLoading(false);
    }
  };

  const selectToken = (token: Token) => {
    if (selectorOpen === "from") {
      if (token.symbol === toToken?.symbol) setToToken(fromToken);
      setFromToken(token);
    } else {
      if (token.symbol === fromToken?.symbol) setFromToken(toToken);
      setToToken(token);
    }
    setSelectorOpen(null);
  };

  const TokenSelector = ({ token, side }: { token?: Token; side: "from" | "to" }) => (
    <button
      onClick={() => setSelectorOpen(selectorOpen === side ? null : side)}
      className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900"
    >
      {token ? (
        <>
          <TokenIcon symbol={token.symbol} logoURI={token.logoURI} size="sm" />
          {token.symbol}
        </>
      ) : (
        "Select"
      )}
      <ChevronDown className="h-3 w-3 text-gray-400" />
    </button>
  );

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4", className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Swap</h3>

      {/* From */}
      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
          <TokenSelector token={fromToken} side="from" />
        </div>
        <input
          type="number"
          placeholder="0.00"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
          className="w-full bg-transparent text-xl font-medium text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none tabular-nums"
        />
      </div>

      {/* Switch */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwitch}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
        >
          <ArrowUpDown className="h-4 w-4" />
        </button>
      </div>

      {/* To */}
      <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">To</span>
          <TokenSelector token={toToken} side="to" />
        </div>
        <p className="text-xl font-medium text-gray-900 dark:text-white tabular-nums">
          {toAmount || "0.00"}
        </p>
      </div>

      {/* Rate */}
      {fromToken && toToken && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          1 {fromToken.symbol} = {getMockExchangeRate(fromToken.symbol, toToken.symbol).toFixed(4)} {toToken.symbol}
        </p>
      )}

      {/* Token selector dropdown */}
      {selectorOpen && (
        <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => selectToken(token)}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-left transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <TokenIcon symbol={token.symbol} logoURI={token.logoURI} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{token.symbol}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{token.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Swap button */}
      <Button
        onClick={handleSwap}
        disabled={!fromToken || !toToken || !fromAmount || loading}
        className="w-full mt-4"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Swap"}
      </Button>
    </div>
  );
}

export default TokenSwapWidget;
