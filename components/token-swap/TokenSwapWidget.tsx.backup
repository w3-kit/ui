import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TokenList } from "../token-list/TokenList";
import { ArrowUpDown } from "lucide-react";
import { TokenSymbol, TOKEN_CONFIGS } from "@/config/tokens";
import { Token } from "../token-list/types";


// Define animation keyframes as CSS-in-JS
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }
  
  @keyframes slideDown {
    from { max-height: 0; opacity: 0; }
    to { max-height: 500px; opacity: 1; }
  }
  
  @keyframes slideUp {
    from { max-height: 500px; opacity: 1; }
    to { max-height: 0; opacity: 0; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .animate-slideDown {
    animation: slideDown 0.3s ease-out forwards;
    overflow: hidden;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-in forwards;
    overflow: hidden;
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  .animate-bounce {
    animation: bounce 1s ease infinite;
  }
  
  .transition-height {
    transition: max-height 0.3s ease-out;
  }
`;

// Token icon component with fallback
const TokenIcon = ({ symbol, size = "md" }: { symbol: string; size?: "sm" | "md" | "lg" }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  const token = TOKEN_CONFIGS[symbol as TokenSymbol];
  const logoURI = token?.logoURI;
  
  if (!logoURI || hasError) {
    // Fallback to initials if no image or error loading
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium overflow-hidden flex-shrink-0 animate-fadeIn`}>
        <span className="text-xs">{symbol.substring(0, 2).toUpperCase()}</span>
      </div>
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 relative`}>
      <Image
        src={logoURI}
        alt={symbol}
        width={32}
        height={32}
        className={`w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse">
          <span className="text-xs text-gray-400 dark:text-gray-500">{symbol.substring(0, 1)}</span>
        </div>
      )}
    </div>
  );
};

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
  const [activeSelector, setActiveSelector] = useState<"from" | "to" | null>(null);
  const [animateSwitch, setAnimateSwitch] = useState(false);

  const commonTokens: TokenSymbol[] = [
    "ETH",
    "USDT",
    "USDC",
    "DAI",
    "DOGE",
    "BTC",
  ];

  // Auto-select first token if none selected
  useEffect(() => {
    if (!fromToken && commonTokens.length > 0) {
      setFromToken(commonTokens[0]);
    }
    
    // Auto-select second token if none selected
    if (!toToken && commonTokens.length > 1 && fromToken) {
      const secondToken = commonTokens.find(token => token !== fromToken);
      if (secondToken) {
        setToToken(secondToken);
      }
    }
  }, [fromToken, toToken, commonTokens]);

  // Calculate toAmount based on fromAmount (mock exchange rate)
  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      // Mock exchange rate calculation - in a real app, this would come from an API
      const mockExchangeRate = getMockExchangeRate(fromToken, toToken);
      const calculatedAmount = (parseFloat(fromAmount) * mockExchangeRate).toFixed(6);
      setToAmount(calculatedAmount);
    } else {
      setToAmount("");
    }
  }, [fromToken, toToken, fromAmount]);

  // Mock function to get exchange rates between tokens
  const getMockExchangeRate = (from: TokenSymbol, to: TokenSymbol): number => {
    const rates: Record<string, Record<string, number>> = {
      "ETH": { "USDT": 1800.50, "USDC": 1800.25, "DAI": 1800.10, "DOGE": 15000.75, "BTC": 0.06 },
      "BTC": { "ETH": 16.67, "USDT": 30000.50, "USDC": 30000.25, "DAI": 30000.10, "DOGE": 250000.75 },
      "USDT": { "ETH": 0.00055, "BTC": 0.000033, "USDC": 1.0, "DAI": 0.99, "DOGE": 8.33 },
      "USDC": { "ETH": 0.00055, "BTC": 0.000033, "USDT": 1.0, "DAI": 0.99, "DOGE": 8.33 },
      "DAI": { "ETH": 0.00056, "BTC": 0.000033, "USDT": 1.01, "USDC": 1.01, "DOGE": 8.40 },
      "DOGE": { "ETH": 0.000067, "BTC": 0.000004, "USDT": 0.12, "USDC": 0.12, "DAI": 0.12 }
    };
    
    return rates[from]?.[to] || 1.0;
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount) return;

    try {
      setLoading(true);
      await onSwap(fromToken, toToken, fromAmount);
      
      // Clear amounts after successful swap
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
      // Save current values
      const tempFromToken = fromToken;
      const tempToToken = toToken;
      const tempFromAmount = fromAmount;
      
      // Switch tokens
      setFromToken(tempToToken);
      setToToken(tempFromToken);
      
      // Switch amounts and recalculate
      if (tempFromAmount) {
        const mockExchangeRate = getMockExchangeRate(tempToToken, tempFromToken);
        const newFromAmount = (parseFloat(tempFromAmount) * mockExchangeRate).toFixed(6);
        setFromAmount(newFromAmount);
      } else {
        setFromAmount("");
      }
      
      setAnimateSwitch(false);
    }, 300);
  };

  const handleFromTokenSelect = (token: Token) => {
    if (token.symbol === toToken) {
      // If selecting the same token as "to", swap them
      setToToken(fromToken);
    }
    setFromToken(token.symbol as TokenSymbol);
    setActiveSelector(null);
  };

  const handleToTokenSelect = (token: Token) => {
    if (token.symbol === fromToken) {
      // If selecting the same token as "from", swap them
      setFromToken(toToken);
    }
    setToToken(token.symbol as TokenSymbol);
    setActiveSelector(null);
  };

  const handleFromAmountChange = (value: string) => {
    // Validate input to ensure it's a valid number
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  // Common input field component for both "from" and "to" sections
  const TokenInputField = ({ 
    value, 
    onChange, 
    token, 
    isReadOnly = false,
    onSelectToken,
    selectorActive,
    label,
    showBalance = true
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    token?: TokenSymbol;
    isReadOnly?: boolean;
    onSelectToken: () => void;
    selectorActive: boolean;
    label: string;
    showBalance?: boolean;
  }) => (
    <div className={`space-y-2 transition-all duration-300 ${animateSwitch ? 'opacity-0 transform translate-y-4' : 'opacity-100'}`}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium opacity-80">{label}</label>
        {token && showBalance && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Balance: 0.00</span>
            {!isReadOnly && (
              <button 
                className="text-blue-500 dark:text-blue-400 font-medium hover:underline transition-colors"
                onClick={() => onChange("1.0")} // Mock MAX functionality
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {token && (
              <TokenIcon symbol={token} size="md" />
            )}
            <input
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-transparent outline-none text-lg sm:text-xl font-medium placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              placeholder="0.0"
              readOnly={isReadOnly}
            />
          </div>
          <button
            onClick={onSelectToken}
            className={`flex items-center gap-2 py-1.5 px-2 sm:px-3 rounded-lg 
              ${token ? 'bg-gray-100 dark:bg-gray-600' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'} 
              hover:bg-opacity-80 transition-all duration-200 hover:shadow-sm`}
          >
            {token ? (
              <>
                <TokenIcon symbol={token} size="sm" />
                <span className="font-medium">{token}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${selectorActive ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            ) : (
              <span className="font-medium">Select token</span>
            )}
          </button>
        </div>
        
        {selectorActive && (
          <div className="mt-2 bg-white dark:bg-gray-600 rounded-lg p-2 shadow-md animate-slideDown">
            <TokenList
              tokens={commonTokens.filter(t => t !== (label === "From" ? toToken : fromToken))}
              onTokenSelect={label === "From" ? handleFromTokenSelect : handleToTokenSelect}
              variant="grid"
              className="w-full"
              selectedToken={token}
              showBalances={false}
              showPrices={false}
            />
          </div>
        )}
      </div>
    </div>
  );

  // Get exchange rate for display
  const getExchangeRateDisplay = () => {
    if (!fromToken || !toToken) return null;
    
    const rate = getMockExchangeRate(fromToken, toToken);
    return `1 ${fromToken} ≈ ${rate.toFixed(6)} ${toToken}`;
  };

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <div
        className={`
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 w-full max-w-md mx-auto transition-colors duration-200
          animate-fadeIn
          ${className}
        `}
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Header with settings */}
          <div className="flex justify-between items-center mb-2 animate-slideDown">
            <h2 className="text-lg font-medium">Swap Tokens</h2>
            <button
              onClick={() => setShowSlippageSettings(!showSlippageSettings)}
              className="text-xs flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${showSlippageSettings ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>

          {/* From Token Section */}
          <TokenInputField
            value={fromAmount}
            onChange={handleFromAmountChange}
            token={fromToken}
            onSelectToken={() => setActiveSelector(activeSelector === "from" ? null : "from")}
            selectorActive={activeSelector === "from"}
            label="From"
          />

          {/* Switch Button */}
          <div className="relative h-8 sm:h-10 flex items-center justify-center">
            <button
              onClick={switchTokens}
              className={`p-1.5 sm:p-2 rounded-full
                bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                transition-all duration-300 shadow-sm hover:shadow
                ${animateSwitch ? 'animate-spin' : 'hover:rotate-180'}`}
              disabled={!fromToken || !toToken || animateSwitch}
            >
              <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* To Token Section */}
          <TokenInputField
            value={toAmount}
            onChange={setToAmount}
            token={toToken}
            isReadOnly={true}
            onSelectToken={() => setActiveSelector(activeSelector === "to" ? null : "to")}
            selectorActive={activeSelector === "to"}
            label="To"
          />

          {/* Exchange Rate */}
          {fromToken && toToken && (
            <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between animate-fadeIn">
              <span>Exchange Rate:</span>
              <div className="flex items-center gap-1">
                <span>{getExchangeRateDisplay()}</span>
              </div>
            </div>
          )}

          {/* Slippage Settings */}
          <div 
            className={`space-y-2 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 transition-height overflow-hidden
              ${showSlippageSettings ? 'max-h-40 opacity-100 p-3 sm:p-4' : 'max-h-0 opacity-0 p-0'}`}
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
                        ? "bg-blue-500 text-white shadow-sm"
                        : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
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
                  className="w-16 sm:w-20 px-2 py-1 rounded-lg text-center text-sm bg-white dark:bg-gray-600 transition-all"
                  step="0.1"
                  min="0.1"
                  max="20"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!fromToken || !toToken || !fromAmount || loading}
            className={`
              w-full py-3 sm:py-4 px-4 rounded-xl font-medium text-white text-sm sm:text-base
              transition-all duration-300
              ${
                !fromToken || !toToken || !fromAmount || loading
                  ? "bg-gray-400 cursor-not-allowed opacity-50"
                  : "bg-blue-500 hover:bg-blue-600 active:scale-[0.98] hover:shadow-lg"
              }
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
    </>
  );
}