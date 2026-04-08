"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Copy, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { ENSResult, RecentSearch, ENSResolverProps } from "./types";
import {
  getEtherscanUrl,
  truncateAddress,
  defaultResolver,
  slideInAnimation,
  buttonAnimation,
} from "./utils";

export const ENSResolver: React.FC<ENSResolverProps> = ({
  onResolve,
  className = "",
  variant = "default",
  resolver = defaultResolver,
}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ENSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [copied, setCopied] = useState<"address" | "ens" | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (inputRef.current?.contains(target)) {
        return;
      }

      if (target.closest(".suggestions-dropdown")) {
        return;
      }

      setShowSuggestions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async (text: string, type: "address" | "ens") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleResolve = async (searchInput: string = input) => {
    if (!searchInput) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const resolvedResult = await resolver(searchInput);

      setResult(resolvedResult);
      onResolve?.(resolvedResult);

      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query: searchInput,
        result: resolvedResult,
        timestamp: Date.now(),
      };

      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (search) => search.query.toLowerCase() !== searchInput.toLowerCase(),
        );
        return [newSearch, ...filtered].slice(0, 5);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resolve");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setInput("");
    setResult(null);
    setError(null);
    setShowSuggestions(false);
    setCopied(null);
  };

  useEffect(() => {
    resetState();
  }, [variant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);

    const hasMatch = recentSearches.some(
      (search) =>
        search.query.toLowerCase().includes(newValue.toLowerCase()) ||
        newValue.toLowerCase().includes(search.query.toLowerCase()),
    );

    setShowSuggestions(hasMatch && newValue.length > 0);
  };

  if (variant === "compact") {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 w-full ${className}`}
      >
        <div className="relative" ref={inputRef}>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(recentSearches.length > 0 && input.length > 0)}
                placeholder="ENS name or address"
                className="w-full px-3 py-2 pl-9 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                  transition-all duration-200"
              />
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <button
              onClick={() => handleResolve()}
              disabled={!input || isLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                disabled:opacity-50 disabled:cursor-not-allowed ${buttonAnimation}
                flex items-center justify-center gap-2 text-sm min-w-[100px]`}
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Resolve</span>
                </>
              )}
            </button>
          </div>

          {/* Recent Searches Dropdown */}
          {showSuggestions && recentSearches.length > 0 && (
            <div
              className={`suggestions-dropdown absolute z-10 w-full mt-1 bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ${slideInAnimation}`}
            >
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => {
                    setInput(search.query);
                    setShowSuggestions(false);
                    handleResolve(search.query);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg
                    flex items-center space-x-2 text-sm"
                >
                  {search.result.avatar && (
                    <img
                      src={search.result.avatar}
                      alt="Avatar"
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span className="text-gray-900 dark:text-white">{search.query}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className={`mt-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg ${slideInAnimation}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.avatar && (
                  <img
                    src={result.avatar}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-700"
                  />
                )}
                <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 flex-wrap">
                  {result.ensName && (
                    <button
                      onClick={() => handleCopy(result.ensName!, "ens")}
                      className="font-medium text-gray-900 dark:text-white hover:text-blue-500
                        dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                      {result.ensName}
                      {copied === "ens" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  )}
                  {result.ensName && result.address && (
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  )}
                  {result.address && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(result.address!, "address")}
                        className="font-medium text-gray-900 dark:text-white font-mono hover:text-blue-500
                          dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                      >
                        {truncateAddress(result.address)}
                        {copied === "address" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        )}
                      </button>
                      <a
                        href={getEtherscanUrl(result.address!, "address")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400
                          dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-full ${className}`}
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
        ENS Resolver
      </h2>

      <div className="space-y-4">
        <div className="relative" ref={inputRef}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(recentSearches.length > 0 && input.length > 0)}
            placeholder="Enter ENS name or Ethereum address"
            className="w-full px-4 py-3 pl-11 text-base
              border border-gray-200 dark:border-gray-700 rounded-lg
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              transition-all duration-200"
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />

          {/* Recent Searches Dropdown */}
          {showSuggestions && recentSearches.length > 0 && (
            <div
              className={`suggestions-dropdown absolute z-10 w-full mt-1 bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg ${slideInAnimation}`}
            >
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => {
                    setInput(search.query);
                    setShowSuggestions(false);
                    handleResolve(search.query);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg
                    flex items-center space-x-2"
                >
                  {search.result.avatar && (
                    <img
                      src={search.result.avatar}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-900 dark:text-white">{search.query}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => handleResolve()}
          disabled={!input || isLoading}
          className={`w-full px-4 py-3 bg-blue-500 text-white rounded-lg
            hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
            ${buttonAnimation} flex items-center justify-center space-x-2 text-base`}
        >
          {isLoading ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Resolve</span>
            </>
          )}
        </button>

        {error && (
          <div
            className={`p-4 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400
            rounded-lg text-sm flex items-center space-x-2 ${slideInAnimation}`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div
            className={`p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-4 ${slideInAnimation}`}
          >
            {result.avatar && (
              <div className="flex justify-center">
                <img
                  src={result.avatar}
                  alt="ENS Avatar"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full ring-4 ring-white dark:ring-gray-700"
                />
              </div>
            )}

            <div className="space-y-3">
              {result.ensName && (
                <div
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800
                  rounded-lg group hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ENS Name</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.ensName}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(result.ensName!, "ens")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === "ens" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy
                        className="w-5 h-5 text-gray-400 hover:text-gray-600
                        dark:text-gray-500 dark:hover:text-gray-300"
                      />
                    )}
                  </button>
                </div>
              )}

              {result.address && (
                <div
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800
                  rounded-lg group hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
                    <div className="font-medium text-gray-900 dark:text-white font-mono flex items-center gap-2">
                      {truncateAddress(result.address)}
                      <a
                        href={getEtherscanUrl(result.address!, "address")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400
                          dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(result.address!, "address")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied === "address" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy
                        className="w-5 h-5 text-gray-400 hover:text-gray-600
                        dark:text-gray-500 dark:hover:text-gray-300"
                      />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
