import React, { useState } from "react";
import { TokenList } from "../token-list/TokenList";
import { ArrowUpDown } from "lucide-react";
import { TokenSymbol } from "../../config/tokens";
import { Token } from "../token-list/types";


interface TokenSwapWidgetProps {
  onSwap: (
    fromToken: TokenSymbol,
    toToken: TokenSymbol,
    amount: string
  ) => Promise<void>;
  defaultSlippage?: number;
  className?: string;
}

export function TokenSwapWidget({
  onSwap,
  defaultSlippage = 0.5,
  className = "",
}: TokenSwapWidgetProps) {
  const [fromToken, setFromToken] = useState<TokenSymbol | undefined>(undefined);
  const [toToken, setToToken] = useState<TokenSymbol | undefined>(undefined);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(defaultSlippage);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);

  const commonTokens: TokenSymbol[] = [
    "ETH",
    "USDT",
    "USDC",
    "DAI",
    "DOGE",
    "BTC",
  ];

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) return;

    try {
      setLoading(true);
      await onSwap(fromToken, toToken, fromAmount);
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromTokenSelect = (token: Token) => {
    if (token.symbol === toToken) return;
    setFromToken(token.symbol as TokenSymbol);
    console.log("Selected:", token);
  };

  const handleToTokenSelect = (token: Token) => {
    if (token.symbol === fromToken) return;
    setToToken(token.symbol as TokenSymbol);
    console.log("Selected:", token);
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
        rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 w-full max-w-md mx-auto transition-colors duration-200
        ${className}
      `}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* From Token Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium opacity-80">From</label>
            <button
              onClick={() => setShowSlippageSettings(!showSlippageSettings)}
              className="text-xs opacity-60 hover:opacity-100 transition-opacity"
            >
              Settings
            </button>
          </div>
          <div className="flex flex-col space-y-2 p-2 sm:p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="w-full bg-transparent outline-none text-base sm:text-lg font-medium placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="0.0"
            />
            <TokenList
              tokens={commonTokens.filter(t => t !== toToken)}
              onTokenSelect={handleFromTokenSelect}
              variant="grid"
              className="w-full bg-white dark:bg-gray-600 rounded-lg p-2"
              selectedToken={fromToken}
            />
          </div>
        </div>

        {/* Switch Button */}
        <div className="relative h-8 sm:h-10 flex items-center justify-center">
          <button
            onClick={switchTokens}
            className="p-1.5 sm:p-2 rounded-full
              bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
              transition-colors duration-200"
          >
            <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* To Token Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-80">To</label>
          <div className="flex flex-col space-y-2 p-2 sm:p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
            <input
              type="number"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="w-full bg-transparent outline-none text-base sm:text-lg font-medium placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="0.0"
              readOnly
            />
            <TokenList
              tokens={commonTokens.filter(t => t !== fromToken)}
              onTokenSelect={handleToTokenSelect}
              variant="grid"
              className="w-full bg-white dark:bg-gray-600 rounded-lg p-2"
              selectedToken={toToken}
            />
          </div>
        </div>

        {/* Slippage Settings */}
        {showSlippageSettings && (
          <div className="space-y-2 p-2 sm:p-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-700">
            <label className="block font-medium opacity-80 mb-2">
              Slippage Tolerance
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[0.1, 0.5, 1.0].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`
                    px-2 sm:px-3 py-1 rounded-lg text-sm transition-colors duration-200
                    ${
                      slippage === value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                    }
                  `}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
                className="w-16 sm:w-20 px-2 py-1 rounded-lg text-center text-sm bg-white dark:bg-gray-600"
                step="0.1"
                min="0.1"
                max="20"
              />
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!fromToken || !toToken || !fromAmount || loading}
          className={`
            w-full py-3 sm:py-4 px-4 rounded-xl font-medium text-white text-sm sm:text-base
            transition-all duration-200
            ${
              !fromToken || !toToken || !fromAmount || loading
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-500 hover:bg-blue-600 active:scale-[0.98]"
            }
          `}
        >
          {loading ? "Swapping..." : "Swap"}
        </button>
      </div>
    </div>
  );
}