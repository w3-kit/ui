"use client";

import React, { useState, useEffect, useRef } from "react";
import { Token, TokenPrice, PriceTickerProps } from "./types";
import {
  formatCurrency,
  formatMarketCap,
  formatPercentage,
  formatTime,
} from "./utils";

export const PriceTicker: React.FC<PriceTickerProps> = ({
  tokens,
  className = "",
  refreshInterval = 10000,
  onPriceUpdate,
  variant = "detailed",
}) => {
  const [prices, setPrices] = useState<Token[]>(tokens);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updatePrices = () => {
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
          const tokenPrices: TokenPrice[] = updatedPrices.map((token) => ({
            symbol: token.symbol,
            price: token.price,
            change24h: token.priceChange["24h"],
            logoURI: token.logoURI,
          }));

          onPriceUpdate(tokenPrices);
        }

        setTimeout(() => setRefreshing(false), 500);
      }, 1000);
    };

    updatePrices();

    timerRef.current = setInterval(updatePrices, refreshInterval);

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
        const tokenPrices: TokenPrice[] = updatedPrices.map((token) => ({
          symbol: token.symbol,
          price: token.price,
          change24h: token.priceChange["24h"],
          logoURI: token.logoURI,
        }));

        onPriceUpdate(tokenPrices);
      }

      setTimeout(() => setRefreshing(false), 500);

      timerRef.current = setInterval(() => {
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
        className={`bg-card rounded-lg shadow-md overflow-hidden ${className}`}
      >
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">
            Market Prices
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
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
              className={`text-muted-foreground hover:text-foreground
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
                  className="flex-shrink-0 px-3 py-1.5 bg-muted rounded-full
                    flex items-center space-x-2 cursor-pointer hover:bg-accent
                    transition-all duration-200 transform hover:scale-105"
                  onClick={() => handleTokenClick(token.symbol)}
                >
                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.name}
                      width={16}
                      height={16}
                      className="rounded-full w-4 h-4"
                    />
                  )}
                  <span className="text-xs font-medium text-foreground">
                    {token.symbol}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      token.priceChange["24h"] > 0
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {formatPercentage(token.priceChange["24h"])}
                  </span>
                </div>
              ))}
            </div>

            {showDetails && (
              <div className="p-3 border-t border-border">
                <div className="space-y-3">
                  {prices.map((token) => (
                    <div
                      key={token.symbol}
                      className={`p-2 rounded-lg transition-all duration-200
                        ${
                          selectedToken === token.symbol
                            ? "bg-info-muted"
                            : "hover:bg-accent"
                        }`}
                      onClick={() => handleTokenClick(token.symbol)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {token.logoURI && (
                            <img
                              src={token.logoURI}
                              alt={token.name}
                              width={24}
                              height={24}
                              className="rounded-full w-6 h-6"
                            />
                          )}
                          <div>
                            <div className="font-medium text-foreground">
                              {token.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {token.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-foreground">
                            {formatCurrency(token.price)}
                          </div>
                          <div
                            className={`text-xs ${
                              token.priceChange["24h"] > 0
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {formatPercentage(token.priceChange["24h"])}
                          </div>
                        </div>
                      </div>

                      {selectedToken === token.symbol && (
                        <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3 text-sm animate-fadeIn">
                          <div>
                            <div className="text-muted-foreground">
                              Market Cap
                            </div>
                            <div className="font-medium text-foreground">
                              {formatMarketCap(token.marketCap)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Volume (24h)
                            </div>
                            <div className="font-medium text-foreground">
                              {formatMarketCap(token.volume["24h"])}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Change (7d)
                            </div>
                            <div
                              className={`font-medium ${
                                token.priceChange["7d"] > 0
                                  ? "text-success"
                                  : "text-destructive"
                              }`}
                            >
                              {formatPercentage(token.priceChange["7d"])}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">
                              Last Updated
                            </div>
                            <div className="font-medium text-foreground">
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

  return (
    <div
      className={`bg-card rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground mb-2 sm:mb-0">
          Market Prices
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Auto-refresh: {refreshInterval / 1000}s
          </span>
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className={`p-1.5 rounded-full bg-muted
              text-muted-foreground hover:bg-accent
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
        <div className="min-w-full divide-y divide-border">
          <div className="bg-muted hidden sm:flex">
            <div className="px-4 py-3 w-2/5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Token
            </div>
            <div className="px-4 py-3 w-1/5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Price
            </div>
            <div className="px-4 py-3 w-1/5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              24h Change
            </div>
            <div className="px-4 py-3 w-1/5 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:block">
              Market Cap
            </div>
          </div>

          <div className="bg-card divide-y divide-border">
            {prices.map((token) => (
              <div key={token.symbol} className="transition-colors duration-150">
                <div
                  className="hover:bg-accent cursor-pointer transition-colors duration-200"
                  onClick={() => handleTokenClick(token.symbol)}
                >
                  <div className="flex flex-wrap items-center py-4 px-4">
                    <div className="w-full sm:w-2/5 flex items-center space-x-3 mb-2 sm:mb-0">
                      {token.logoURI && (
                        <img
                          src={token.logoURI}
                          alt={token.name}
                          width={32}
                          height={32}
                          className="rounded-full w-8 h-8"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-foreground flex items-center">
                          {token.name}
                          <svg
                            className={`w-4 h-4 ml-1 text-muted-foreground transition-transform duration-300 ${
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
                        <div className="text-xs text-muted-foreground">
                          {token.symbol}
                        </div>
                      </div>
                    </div>

                    <div className="w-1/3 sm:w-1/5 text-right">
                      <div className="text-sm font-medium text-foreground group relative">
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

                    <div className="w-1/3 sm:w-1/5 text-right">
                      <div
                        className={`text-sm font-medium ${
                          token.priceChange["24h"] > 0
                            ? "text-success"
                            : "text-destructive"
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

                    <div className="hidden lg:block w-1/5 text-right">
                      <div className="text-sm text-foreground">
                        {formatMarketCap(token.marketCap)}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden bg-muted border-t border-border
                    ${
                      selectedToken === token.symbol
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Price Changes
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            1h
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              token.priceChange["1h"] > 0
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {formatPercentage(token.priceChange["1h"])}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            24h
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              token.priceChange["24h"] > 0
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {formatPercentage(token.priceChange["24h"])}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            7d
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              token.priceChange["7d"] > 0
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {formatPercentage(token.priceChange["7d"])}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            30d
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              token.priceChange["30d"] > 0
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {formatPercentage(token.priceChange["30d"])}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Market Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Market Cap
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {formatMarketCap(token.marketCap)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Volume (24h)
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {formatMarketCap(token.volume["24h"])}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Circulating Supply
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {token.circulatingSupply.toLocaleString()}{" "}
                            {token.symbol}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Max Supply
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {token.maxSupply
                              ? token.maxSupply.toLocaleString()
                              : "∞"}{" "}
                            {token.symbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Price Chart (7d)
                      </h4>
                      <div className="h-24 flex items-end space-x-1">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const height = 30 + Math.random() * 70;
                          return (
                            <div
                              key={i}
                              className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary-hover"
                              style={{ height: `${height}%` }}
                            ></div>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
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

export default PriceTicker;
