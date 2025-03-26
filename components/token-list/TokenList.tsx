import React, { useState, useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { TokenListProps, SortField, SortDirection } from "./types";
import { formatBalance, formatCurrency } from "./utils";
import { TOKEN_CONFIGS } from "@/config/tokens";

interface Token {
  name: string;
  symbol: string;
  logoURI?: string;
  balance?: string;
  price?: number;
  decimals: number;
  chainId: number;
  address: string;
}

// Memoized token image component with fallback
const TokenImage = memo(({ logoURI, symbol, size = "md" }: { logoURI?: string; symbol: string; size?: "sm" | "md" | "lg" }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const sizeClasses = {
    sm: "w-6 h-6 min-w-[1.5rem]",
    md: "w-8 h-8 min-w-[2rem]",
    lg: "w-10 h-10 min-w-[2.5rem]"
  };
  
  if (!logoURI || hasError) {
    // Fallback to initials if no image or error loading
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium overflow-hidden flex-shrink-0 animate-fadeIn`}>
        <span className="text-xs sm:text-sm">{symbol.substring(0, 2).toUpperCase()}</span>
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
});
TokenImage.displayName = "TokenImage";

// Memoized token card for grid view
const TokenGridCard = memo(({ 
  token, 
  isSelected, 
  onSelect, 
  showBalances, 
  showPrices 
}: { 
  token: Token;
  isSelected: boolean;
  onSelect: () => void;
  showBalances: boolean;
  showPrices: boolean;
}) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 cursor-pointer
        border border-gray-200 dark:border-gray-700 
        hover:shadow-md dark:hover:shadow-gray-800 hover:border-blue-200 dark:hover:border-blue-800
        transform transition-all duration-200 hover:-translate-y-1 h-full
        ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-md" : ""}`}
    >
      <div className="flex items-center space-x-3">
        <TokenImage logoURI={token.logoURI} symbol={token.symbol} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {token.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {token.symbol}
          </p>
        </div>
        {isSelected && (
          <div className="flex-shrink-0 text-blue-500 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="mt-3 space-y-1">
        {showBalances && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Balance:</span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2 truncate">
              {formatBalance(token.balance || "0", token.decimals)}
            </p>
          </div>
        )}
        
        {showPrices && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Price:</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white ml-2 truncate">
              {formatCurrency(token.price || 0)}
            </p>
          </div>
        )}
        
        {showPrices && showBalances && (
          <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-gray-700 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Value:</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white ml-2 truncate">
              {token.price && token.balance
                ? formatCurrency(Number(token.balance) * token.price)
                : "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
TokenGridCard.displayName = "TokenGridCard";

// Memoized token row for list view
const TokenListRow = memo(({ 
  token, 
  isSelected, 
  onSelect, 
  showBalances, 
  showPrices 
}: { 
  token: Token;
  isSelected: boolean;
  onSelect: () => void;
  showBalances: boolean;
  showPrices: boolean;
}) => {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between p-3 sm:p-4 cursor-pointer
        bg-white dark:bg-gray-800 
        hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
        ${isSelected ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400" : "border-l-4 border-transparent"}`}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <TokenImage logoURI={token.logoURI} symbol={token.symbol} size="md" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 dark:text-white truncate">
            {token.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {token.symbol}
          </div>
        </div>
        {isSelected && (
          <div className="flex-shrink-0 text-blue-500 dark:text-blue-400 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4 sm:space-x-6 flex-shrink-0">
        {showBalances && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 dark:text-gray-400">Balance</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {formatBalance(token.balance || "0", token.decimals)}
            </span>
          </div>
        )}
        
        {showPrices && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 dark:text-gray-400">Value</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
              {token.price && token.balance
                ? formatCurrency(Number(token.balance) * token.price)
                : "-"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
TokenListRow.displayName = "TokenListRow";

export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  onTokenSelect,
  className = "",
  showBalances = true,
  showPrices = true,
  variant = "table",
  selectedToken,
}) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isCompact, setIsCompact] = useState(variant === "grid" && tokens.length > 6);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const tokenList = useMemo(() => {
    return tokens.map((token) => {
      if (typeof token === "string") {
        return {
          ...TOKEN_CONFIGS[token],
          balance: "0", // This would be fetched from the wallet
          price: 0, // This would be fetched from an API
        };
      }
      return token; // If it's already a Token object, return as is
    });
  }, [tokens]);

  const filteredAndSortedTokens = useMemo(() => {
    let result = tokenList;

    // Filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (token) =>
          token.name.toLowerCase().includes(searchLower) ||
          token.symbol.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "balance":
          comparison = Number(b.balance || 0) - Number(a.balance || 0);
          break;
        case "value":
          comparison =
            Number(b.balance || 0) * (b.price || 0) -
            Number(a.balance || 0) * (a.price || 0);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tokenList, search, sortField, sortDirection]);

  // Determine optimal grid columns based on token count
  const getGridCols = useCallback(() => {
    const count = filteredAndSortedTokens.length;
    if (count <= 2) return "grid-cols-1";
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2";
    if (count <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  }, [filteredAndSortedTokens.length]);

  const renderVariant = () => {
    switch (variant) {
      case "grid":
        return (
          <>
            {tokens.length > 6 && (
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsCompact(!isCompact)}
                  className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {isCompact ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      <span>Show All</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v4m0 0h4M4 4l5 5M4 16v4m0 0h4m-4 0l5-5m11-9V4m0 0h-4m4 0l-5 5M20 16v4m0 0h-4m4 0l-5-5" />
                      </svg>
                      <span>Compact View</span>
                    </>
                  )}
                </button>
              </div>
            )}
            <div className={`grid ${getGridCols()} gap-2 sm:gap-3 md:gap-4`}>
              {(isCompact ? filteredAndSortedTokens.slice(0, 6) : filteredAndSortedTokens).map((token, index) => (
                <TokenGridCard
                  key={`${token.chainId}-${token.address}-${index}`}
                  token={token}
                  isSelected={selectedToken === token.symbol}
                  onSelect={() => onTokenSelect?.(token)}
                  showBalances={showBalances}
                  showPrices={showPrices}
                />
              ))}
            </div>
            {isCompact && filteredAndSortedTokens.length > 6 && (
              <button
                onClick={() => setIsCompact(false)}
                className="w-full mt-3 py-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 
                  border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Show {filteredAndSortedTokens.length - 6} more tokens
              </button>
            )}
          </>
        );

      case "list":
        return (
          <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {filteredAndSortedTokens.length > 0 ? (
              filteredAndSortedTokens.map((token, index) => (
                <TokenListRow
                  key={`${token.chainId}-${token.address}-${index}`}
                  token={token}
                  isSelected={selectedToken === token.symbol}
                  onSelect={() => onTokenSelect?.(token)}
                  showBalances={showBalances}
                  showPrices={showPrices}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No tokens found matching your search.
              </div>
            )}
          </div>
        );

      default: // table variant
        return (
          <div className={`w-full ${className}`}>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th
                      className="px-3 sm:px-6 py-3 text-left text-xs font-medium 
                        text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <span className="flex items-center gap-2">
                        Token
                        {sortField === "name" && (
                          <span className="text-gray-400">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </span>
                    </th>
                    {showBalances && (
                      <th
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium 
                          text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("balance")}
                      >
                        <span className="flex items-center gap-2">
                          Balance
                          {sortField === "balance" && (
                            <span className="text-gray-400">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </span>
                      </th>
                    )}
                    {showPrices && (
                      <>
                        <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th
                          className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("value")}
                        >
                          <span className="flex items-center gap-2">
                            Value
                            {sortField === "value" && (
                              <span className="text-gray-400">
                                {sortDirection === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </span>
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredAndSortedTokens.map((token, index) => (
                    <tr
                      key={`${token.chainId}-${token.address}-${index}`}
                      onClick={() => onTokenSelect?.(token)}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                        ${
                          selectedToken === token.symbol
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }`}
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <TokenImage logoURI={token.logoURI} symbol={token.symbol} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                              {token.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                              {token.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      {showBalances && (
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900 dark:text-white">
                          {formatBalance(token.balance || "0", token.decimals)}
                        </td>
                      )}
                      {showPrices && (
                        <>
                          <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900 dark:text-white">
                            {token.price ? formatCurrency(token.price) : "-"}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900 dark:text-white">
                            {token.price && token.balance
                              ? formatCurrency(
                                  Number(token.balance) * token.price
                                )
                              : "-"}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base 
            border border-gray-200 dark:border-gray-700 rounded-lg 
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {filteredAndSortedTokens.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No tokens found matching your search.</p>
        </div>
      ) : (
        renderVariant()
      )}
    </div>
  );
};
