"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { Token, TokenSwapWidgetProps } from "./types";
import { animationStyles, defaultTokens, getMockExchangeRate } from "./utils";

const TokenIcon = ({
  token,
  size = "md",
}: {
  token?: Token;
  size?: "sm" | "md" | "lg";
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (!token?.logoURI || hasError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-info-muted flex items-center justify-center text-primary font-medium overflow-hidden flex-shrink-0 animate-fadeIn`}
      >
        <span className="text-xs">
          {token?.symbol.substring(0, 2).toUpperCase() || "??"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 bg-muted border border-border relative`}
    >
      <img
        src={token.logoURI}
        alt={token.symbol}
        width={32}
        height={32}
        className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        style={{ width: "100%", height: "100%" }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <span className="text-xs text-muted-foreground">
            {token.symbol.substring(0, 1)}
          </span>
        </div>
      )}
    </div>
  );
};

export function TokenSwapWidget({
  onSwap,
  defaultSlippage = 0.5,
  className = "",
  tokens = defaultTokens,
}: TokenSwapWidgetProps) {
  const [fromToken, setFromToken] = useState<Token | undefined>(tokens[0]);
  const [toToken, setToToken] = useState<Token | undefined>(tokens[1]);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(defaultSlippage);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);
  const [activeSelector, setActiveSelector] = useState<"from" | "to" | null>(
    null
  );
  const [animateSwitch, setAnimateSwitch] = useState(false);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = animationStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const mockExchangeRate = getMockExchangeRate(
        fromToken.symbol,
        toToken.symbol
      );
      const calculatedAmount = (
        parseFloat(fromAmount) * mockExchangeRate
      ).toFixed(6);
      setToAmount(calculatedAmount);
    } else {
      setToAmount("");
    }
  }, [fromToken, toToken, fromAmount]);

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) return;

    try {
      setLoading(true);
      await onSwap(fromToken.symbol, toToken.symbol, fromAmount);

      setFromAmount("");
      setToAmount("");
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    if (!fromToken || !toToken) return;

    setAnimateSwitch(true);

    setTimeout(() => {
      const tempFromToken = fromToken;
      const tempToToken = toToken;
      const tempFromAmount = fromAmount;

      setFromToken(tempToToken);
      setToToken(tempFromToken);

      if (tempFromAmount) {
        const mockExchangeRate = getMockExchangeRate(
          tempToToken.symbol,
          tempFromToken.symbol
        );
        const newFromAmount = (
          parseFloat(tempFromAmount) * mockExchangeRate
        ).toFixed(6);
        setFromAmount(newFromAmount);
      } else {
        setFromAmount("");
      }

      setAnimateSwitch(false);
    }, 300);
  };

  const handleFromTokenSelect = (token: Token) => {
    if (token.symbol === toToken?.symbol) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setActiveSelector(null);
  };

  const handleToTokenSelect = (token: Token) => {
    if (token.symbol === fromToken?.symbol) {
      setFromToken(toToken);
    }
    setToToken(token);
    setActiveSelector(null);
  };

  const handleFromAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const TokenInputField = ({
    value,
    onChange,
    token,
    isReadOnly = false,
    onSelectToken,
    selectorActive,
    label,
    showBalance = true,
  }: {
    value: string;
    onChange: (value: string) => void;
    token?: Token;
    isReadOnly?: boolean;
    onSelectToken: () => void;
    selectorActive: boolean;
    label: string;
    showBalance?: boolean;
  }) => (
    <div
      className={`space-y-2 transition-all duration-300 ${animateSwitch ? "opacity-0 transform translate-y-4" : "opacity-100"}`}
    >
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium opacity-80">{label}</label>
        {token && showBalance && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Balance: 0.00</span>
            {!isReadOnly && (
              <button
                className="text-primary font-medium hover:underline transition-colors"
                onClick={() => onChange("1.0")}
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2 p-3 sm:p-4 rounded-xl bg-muted transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {token && <TokenIcon token={token} size="md" />}
            <input
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-transparent outline-none text-lg sm:text-xl font-medium placeholder:text-muted-foreground transition-all"
              placeholder="0.0"
              readOnly={isReadOnly}
            />
          </div>
          <button
            onClick={onSelectToken}
            className={`flex items-center gap-2 py-1.5 px-2 sm:px-3 rounded-lg
              ${token ? "bg-muted" : "bg-info-muted text-primary"}
              hover:bg-opacity-80 transition-all duration-200 hover:shadow-sm`}
          >
            {token ? (
              <>
                <TokenIcon token={token} size="sm" />
                <span className="font-medium">{token.symbol}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${selectorActive ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            ) : (
              <span className="font-medium">Select token</span>
            )}
          </button>
        </div>

        {selectorActive && (
          <div className="mt-2 bg-card rounded-lg p-2 shadow-md animate-slideDown">
            <div className="grid grid-cols-2 gap-2">
              {tokens
                .filter(
                  (t) =>
                    t.symbol !==
                    (label === "From" ? toToken?.symbol : fromToken?.symbol)
                )
                .map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() =>
                      label === "From"
                        ? handleFromTokenSelect(t)
                        : handleToTokenSelect(t)
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      token?.symbol === t.symbol
                        ? "bg-info-muted/50"
                        : "hover:bg-accent"
                    }`}
                  >
                    <TokenIcon token={t} size="sm" />
                    <span className="text-sm font-medium">{t.symbol}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const getExchangeRateDisplay = () => {
    if (!fromToken || !toToken) return null;

    const rate = getMockExchangeRate(fromToken.symbol, toToken.symbol);
    return `1 ${fromToken.symbol} ≈ ${rate.toFixed(6)} ${toToken.symbol}`;
  };

  return (
    <div
      className={`
        bg-card text-foreground
        rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 w-full max-w-md mx-auto transition-colors duration-200
        animate-fadeIn
        ${className}
      `}
    >
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center mb-2 animate-slideDown">
          <h2 className="text-lg font-medium">Swap Tokens</h2>
          <button
            onClick={() => setShowSlippageSettings(!showSlippageSettings)}
            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${showSlippageSettings ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </button>
        </div>

        <TokenInputField
          value={fromAmount}
          onChange={handleFromAmountChange}
          token={fromToken}
          onSelectToken={() =>
            setActiveSelector(activeSelector === "from" ? null : "from")
          }
          selectorActive={activeSelector === "from"}
          label="From"
        />

        <div className="relative h-8 sm:h-10 flex items-center justify-center">
          <button
            onClick={switchTokens}
            className={`p-1.5 sm:p-2 rounded-full
              bg-muted hover:bg-accent
              transition-all duration-300 shadow-sm hover:shadow
              ${animateSwitch ? "animate-spin" : "hover:rotate-180"}`}
            disabled={!fromToken || !toToken || animateSwitch}
          >
            <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <TokenInputField
          value={toAmount}
          onChange={setToAmount}
          token={toToken}
          isReadOnly={true}
          onSelectToken={() =>
            setActiveSelector(activeSelector === "to" ? null : "to")
          }
          selectorActive={activeSelector === "to"}
          label="To"
        />

        {fromToken && toToken && (
          <div className="text-xs text-muted-foreground flex justify-between animate-fadeIn">
            <span>Exchange Rate:</span>
            <div className="flex items-center gap-1">
              <span>{getExchangeRateDisplay()}</span>
            </div>
          </div>
        )}

        <div
          className={`space-y-2 rounded-xl text-sm bg-muted transition-height overflow-hidden
            ${showSlippageSettings ? "max-h-40 opacity-100 p-3 sm:p-4" : "max-h-0 opacity-0 p-0"}`}
        >
          <label className="block font-medium opacity-80 mb-2">
            Slippage Tolerance
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[0.1, 0.5, 1.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`
                  px-2 sm:px-3 py-1 rounded-lg text-sm transition-all duration-200
                  ${
                    slippage === value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted hover:bg-accent"
                  }
                `}
              >
                {value}%
              </button>
            ))}
            <div className="relative">
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
                className="w-16 sm:w-20 px-2 py-1 rounded-lg text-center text-sm bg-card transition-all"
                step="0.1"
                min="0.1"
                max="20"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={!fromToken || !toToken || !fromAmount || loading}
          className={`
            w-full py-3 sm:py-4 px-4 rounded-xl font-medium text-primary-foreground text-sm sm:text-base
            transition-all duration-300
            ${
              !fromToken || !toToken || !fromAmount || loading
                ? "bg-muted cursor-not-allowed opacity-50"
                : "bg-primary hover:bg-primary-hover active:scale-[0.98] hover:shadow-lg"
            }
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-primary-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Swapping...</span>
            </div>
          ) : !fromToken || !toToken ? (
            "Select Tokens"
          ) : !fromAmount ? (
            "Enter Amount"
          ) : (
            "Swap"
          )}
        </button>
      </div>
    </div>
  );
}

export default TokenSwapWidget;
