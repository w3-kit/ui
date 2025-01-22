import React, { useState, useEffect } from "react";
import { TokenList } from "../token-list";
import { useTheme } from "next-themes";
import { IoSwapVertical } from "react-icons/io5";
import { TokenSymbol } from "../token-list/tokenConfigs";

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
  const { theme } = useTheme();
  const [fromToken, setFromToken] = useState<TokenSymbol | "">("");
  const [toToken, setToToken] = useState<TokenSymbol | "">("");
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

  return (
    <div
      className={`
      ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
      rounded-2xl shadow-lg p-4 sm:p-6 w-full mx-auto transition-colors duration-200
      ${className}
    `}
    >
      <div className="space-y-4 sm:space-y-6">
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
          <div
            className={`
            flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-3 sm:p-4 rounded-xl
            ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
          `}
          >
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className={`
                w-full sm:flex-1 bg-transparent outline-none text-base sm:text-lg font-medium
                ${theme === "dark" ? "placeholder-gray-500" : "placeholder-gray-400"}
              `}
              placeholder="0.0"
            />
            <TokenList
              tokens={commonTokens}
              onTokenSelect={(token) => console.log("Selected:", token)}
              variant="grid"
              className={`w-full sm:w-auto ${theme === "dark" ? "bg-gray-600" : "bg-white"}`}
            />
          </div>
        </div>

        {/* Switch Button */}
        <div className="relative h-0">
          <button
            onClick={switchTokens}
            className={`
              absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full
              ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }
              transition-colors duration-200
            `}
          >
            <IoSwapVertical className="w-5 h-5" />
          </button>
        </div>

        {/* To Token Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-80">To</label>
          <div
            className={`
            flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-3 sm:p-4 rounded-xl
            ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
          `}
          >
            <input
              type="number"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className={`
                w-full sm:flex-1 bg-transparent outline-none text-base sm:text-lg font-medium
                ${theme === "dark" ? "placeholder-gray-500" : "placeholder-gray-400"}
              `}
              placeholder="0.0"
              readOnly
            />
            <TokenList
              tokens={commonTokens}
              onTokenSelect={(token) => console.log("Selected:", token)}
              variant="grid"
              className={`w-full sm:w-auto ${theme === "dark" ? "bg-gray-600" : "bg-white"}`}
            />
          </div>
        </div>

        {/* Slippage Settings */}
        {showSlippageSettings && (
          <div
            className={`
            space-y-2 p-3 sm:p-4 rounded-xl text-sm
            ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
          `}
          >
            <label className="block font-medium opacity-80 mb-2 sm:mb-3">
              Slippage Tolerance
            </label>
            <div className="flex flex-wrap gap-2">
              {[0.1, 0.5, 1.0].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`
                    px-3 py-1 rounded-lg transition-colors duration-200
                    ${
                      slippage === value
                        ? "bg-blue-500 text-white"
                        : theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-200 hover:bg-gray-300"
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
                className={`
                  w-20 px-2 py-1 rounded-lg text-center
                  ${theme === "dark" ? "bg-gray-600" : "bg-white"}
                `}
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
            w-full py-4 px-4 rounded-xl font-medium text-white
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
