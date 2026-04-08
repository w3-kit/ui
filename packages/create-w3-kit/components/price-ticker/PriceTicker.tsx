import React, { useState, useEffect, useRef } from "react";
import { PriceTickerProps, TokenPrice } from "./types";


// Define Token type since it's missing from the imports
interface Token {
  name: string;
  symbol: string;
  price: number;
  priceChange: {
    "1h": number;
    "24h": number;
    "7d": number;
    "30d": number;
  };
  marketCap: number;
  volume: {
    "24h": number;
  };
  circulatingSupply: number;
  maxSupply: number | null;
  logoURI: string;
  lastUpdated: string;
}

export const PriceTicker: React.FC<PriceTickerProps> = ({
  tokens,
  className = "",
  refreshInterval = 10000, // 10 seconds default
  onPriceUpdate,
  variant = "detailed",
}) => {
  // Cast tokens to Token[] to fix type error
  const [prices, setPrices] = useState<Token[]>(tokens as unknown as Token[]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate price updates
  useEffect(() => {
    const updatePrices = () => {
      setRefreshing(true);
      setIsLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        const updatedPrices = prices.map((token) => {
          // Random price change between -2% and +2%
          const changePercent = (Math.random() * 4 - 2) / 100;
          const newPrice = token.price * (1 + changePercent);

          return {
            ...token,
            price: parseFloat(newPrice.toFixed(2)),
            priceChange: {
              ...token.priceChange,
              "24h": parseFloat(
                (token.priceChange["24h"] + changePercent * 100).toFixed(2)
              ),
            },
            lastUpdated: new Date().toISOString(),
          };
        });

        setPrices(updatedPrices);
        setIsLoading(false);

        if (onPriceUpdate) {
          // Convert to TokenPrice format
          const tokenPrices: TokenPrice[] = updatedPrices.map((token) => ({
            symbol: token.symbol,
            price: token.price,
            change24h: token.priceChange["24h"],
            logoURI: token.logoURI,
          }));

          onPriceUpdate(tokenPrices);
        }

        // Reset refreshing animation after a short delay
        setTimeout(() => setRefreshing(false), 500);
      }, 1000);
    };

    // Initial update
    updatePrices();

    // Set up interval for updates
    timerRef.current = setInterval(updatePrices, refreshInterval);

    // Clean up interval on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [refreshInterval, onPriceUpdate]);

  const handleManualRefresh = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Trigger immediate update
    setRefreshing(true);
    setIsLoading(true);

    setTimeout(() => {
      const updatedPrices = prices.map((token) => {
        const changePercent = (Math.random() * 4 - 2) / 100;
        const newPrice = token.price * (1 + changePercent);

        return {
          ...token,
          price: parseFloat(newPrice.toFixed(2)),
          priceChange: {
            ...token.priceChange,
            "24h": parseFloat(
              (token.priceChange["24h"] + changePercent * 100).toFixed(2)
            ),
          },
          lastUpdated: new Date().toISOString(),
        };
      });

      setPrices(updatedPrices);
      setIsLoading(false);

      if (onPriceUpdate) {
        // Convert to TokenPrice format
        const tokenPrices: TokenPrice[] = updatedPrices.map((token) => ({
          symbol: token.symbol,
          price: token.price,
          change24h: token.priceChange["24h"],
          logoURI: token.logoURI,
        }));

        onPriceUpdate(tokenPrices);
      }

      // Reset refreshing animation after a short delay
      setTimeout(() => setRefreshing(false), 500);

      // Restart the interval
      timerRef.current = setInterval(() => {
        // Same update logic as above
        const updatedPrices = prices.map((token) => {
          const changePercent = (Math.random() * 4 - 2) / 100;
          const newPrice = token.price * (1 + changePercent);

          return {
            ...token,
            price: parseFloat(newPrice.toFixed(2)),
            priceChange: {
              ...token.priceChange,
              "24h": parseFloat(
                (token.priceChange["24h"] + changePercent * 100).toFixed(2)
              ),
            },
            lastUpdated: new Date().toISOString(),
          };
        });

        setPrices(updatedPrices);

        if (onPriceUpdate) {
          // Convert to TokenPrice format
          const tokenPrices: TokenPrice[] = updatedPrices.map((token) => ({
            symbol: token.symbol,
            price: token.price,
            change24h: token.priceChange["24h"],
            logoURI: token.logoURI,
          }));

          onPriceUpdate(tokenPrices);
        }
      }, refreshInterval);
    }, 1000);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format market cap in 100w format
  const formatMarketCap = (value: number): string => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 10000000) {
      return `$${(value / 10000000).toFixed(2)}00M`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 100000) {
      return `$${(value / 100000).toFixed(2)}00K`;
    } else if (value >= 10000) {
      return `$${(value / 10000).toFixed(2)}0K`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleTokenClick = (symbol: string) => {
    if (selectedToken === symbol) {
      setSelectedToken(null);
    } else {
      setSelectedToken(symbol);
    }
  };

  if (variant === "compact") {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Market Prices
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={showDetails ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </button>
            <button
              onClick={handleManualRefresh}
              disabled={isLoading}
              className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 
                transition-all duration-300 ${refreshing ? "rotate-180" : ""}`}
            >
              <svg
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out ${
              showDetails ? "max-h-96" : "max-h-12"
            } overflow-hidden`}
          >
            <div className="flex items-center space-x-2 p-2 overflow-x-auto scrollbar-hide">
              {prices.map((token) => (
                <div
                  key={token.symbol}
                  className="flex-shrink-0 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full 
                    flex items-center space-x-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600
                    transition-all duration-200 transform hover:scale-105"
                  onClick={() => handleTokenClick(token.symbol)}
                >
                  {token.logoURI && (
                    <img loading="lazy"
                      src={token.logoURI}
                      alt={token.name}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {token.symbol}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      token.priceChange["24h"] > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatPercentage(token.priceChange["24h"])}
                  </span>
                </div>
              ))}
            </div>

            {showDetails && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  {prices.map((token) => (
                    <div
                      key={token.symbol}
                      className={`p-2 rounded-lg transition-all duration-200 
                        ${
                          selectedToken === token.symbol
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      onClick={() => handleTokenClick(token.symbol)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {token.logoURI && (
                            <img loading="lazy"
                              src={token.logoURI}
                              alt={token.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {token.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {token.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(token.price)}
                          </div>
                          <div
                            className={`text-xs ${
                              token.priceChange["24h"] > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {formatPercentage(token.priceChange["24h"])}
                          </div>
                        </div>
                      </div>

                      {selectedToken === token.symbol && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-3 text-sm animate-fadeIn">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400">
                              Market Cap
                            </div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatMarketCap(token.marketCap)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400">
                              Volume (24h)
                            </div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatMarketCap(token.volume["24h"])}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400">
                              Change (7d)
                            </div>
                            <div
                              className={`font-medium ${
                                token.priceChange["7d"] > 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {formatPercentage(token.priceChange["7d"])}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400">
                              Last Updated
                            </div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatTime(token.lastUpdated)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant with dropdown details
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">
          Market Prices
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
            Auto-refresh: {refreshInterval / 1000}s
          </span>
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className={`p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 
              text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600
              transition-all duration-300 ${refreshing ? "rotate-180" : ""}`}
            aria-label="Refresh prices"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-700/50 hidden sm:flex">
            <div className="px-4 py-3 w-2/5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Token
            </div>
            <div className="px-4 py-3 w-1/5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price
            </div>
            <div className="px-4 py-3 w-1/5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              24h Change
            </div>
            <div className="px-4 py-3 w-1/5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:block">
              Market Cap
            </div>
          </div>

          {/* Token Rows with Dropdown Details */}
          <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {prices.map((token) => (
              <div
                key={token.symbol}
                className="transition-colors duration-150"
              >
                {/* Main Token Row */}
                <div
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  onClick={() => handleTokenClick(token.symbol)}
                >
                  <div className="flex flex-wrap items-center py-4 px-4">
                    {/* Token Info */}
                    <div className="w-full sm:w-2/5 flex items-center space-x-3 mb-2 sm:mb-0">
                      {token.logoURI && (
                        <img loading="lazy"
                          src={token.logoURI}
                          alt={token.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          {token.name}
                          <svg
                            className={`w-4 h-4 ml-1 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                              selectedToken === token.symbol ? "rotate-180" : ""
                            }`}
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
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {token.symbol}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="w-1/3 sm:w-1/5 text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white group relative">
                        <span
                          className={`transition-all duration-300 ${
                            refreshing ? "opacity-0" : "opacity-100"
                          }`}
                        >
                          {formatCurrency(token.price)}
                        </span>
                        {refreshing && (
                          <span className="absolute inset-0 flex items-center justify-end animate-pulse">
                            {formatCurrency(token.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 24h Change */}
                    <div className="w-1/3 sm:w-1/5 text-right">
                      <div
                        className={`text-sm font-medium ${
                          token.priceChange["24h"] > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        } group relative`}
                      >
                        <span
                          className={`transition-all duration-300 ${
                            refreshing ? "opacity-0" : "opacity-100"
                          }`}
                        >
                          {formatPercentage(token.priceChange["24h"])}
                        </span>
                        {refreshing && (
                          <span className="absolute inset-0 flex items-center justify-end animate-pulse">
                            {formatPercentage(token.priceChange["24h"])}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Market Cap - Hidden on mobile */}
                    <div className="hidden lg:block w-1/5 text-right">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatMarketCap(token.marketCap)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dropdown Details */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden bg-gray-50 dark:bg-gray-700/20 border-t border-gray-200 dark:border-gray-700
                    ${
                      selectedToken === token.symbol
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price Changes */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Price Changes
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            1h
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              token.priceChange["1h"] > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {formatPercentage(token.priceChange["1h"])}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            24h
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              token.priceChange["24h"] > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {formatPercentage(token.priceChange["24h"])}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            7d
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              token.priceChange["7d"] > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {formatPercentage(token.priceChange["7d"])}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            30d
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              token.priceChange["30d"] > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {formatPercentage(token.priceChange["30d"])}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Market Stats */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Market Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Market Cap
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatMarketCap(token.marketCap)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Volume (24h)
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatMarketCap(token.volume["24h"])}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Circulating Supply
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {token.circulatingSupply.toLocaleString()}{" "}
                            {token.symbol}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Max Supply
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {token.maxSupply
                              ? token.maxSupply.toLocaleString()
                              : "∞"}{" "}
                            {token.symbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Chart */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Price Chart (7d)
                      </h4>
                      <div className="h-24 flex items-end space-x-1">
                        {/* Simulated chart bars */}
                        {Array.from({ length: 7 }).map((_, i) => {
                          const height = 30 + Math.random() * 70;
                          return (
                            <div
                              key={i}
                              className={`w-full bg-blue-500 dark:bg-blue-400 rounded-t transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-500`}
                              style={{ height: `${height}%` }}
                            ></div>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>7d ago</span>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
