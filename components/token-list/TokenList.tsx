import React, { useState, useMemo, useCallback } from "react";
import { TokenListProps, SortField, SortDirection } from "./types";
import { formatBalance, formatCurrency } from "./utils";
import { TOKEN_CONFIGS } from "../../config/tokens";


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
          comparison = Number(b.balance || 0);
          break;
        case "value":
          comparison =
            Number(a.balance || 0) * (a.price || 0) -
            Number(b.balance || 0) * (b.price || 0);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tokenList, search, sortField, sortDirection]);

  const renderVariant = () => {
    switch (variant) {
      case "grid":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedTokens.map((token) => (
              <div
                key={`${token.chainId}-${token.address}`}
                onClick={() => onTokenSelect?.(token)}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 cursor-pointer
                  border border-gray-200 dark:border-gray-700 
                  hover:shadow-md dark:hover:shadow-gray-800 transition-all
                  ${
                    selectedToken === token.symbol
                      ? "ring-2 ring-blue-500 dark:ring-blue-400"
                      : ""
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {token.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {token.symbol}
                    </p>
                  </div>
                </div>
                {showBalances && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {formatBalance(token.balance, token.decimals)}
                  </p>
                )}
                {showPrices && (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(token.price || 0)}
                  </p>
                )}
              </div>
            ))}
          </div>
        );

      case "list":
        return (
          <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {filteredAndSortedTokens.map((token) => (
              <div
                key={`${token.chainId}-${token.address}`}
                onClick={() => onTokenSelect?.(token)}
                className={`flex items-center justify-between p-4 cursor-pointer
                  bg-white dark:bg-gray-800 
                  hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                  ${
                    selectedToken === token.symbol
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : ""
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {token.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {token.symbol}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  {showBalances && (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {formatBalance(token.balance, token.decimals)}
                    </span>
                  )}
                  {showPrices && (
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(token.price || 0)}
                    </span>
                  )}
                </div>
              </div>
            ))}
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
                  {filteredAndSortedTokens.map((token) => (
                    <tr
                      key={`${token.chainId}-${token.address}`}
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
                          {token.logoURI && (
                            <img
                              src={token.logoURI}
                              alt={token.symbol}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                              {token.name}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {token.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      {showBalances && (
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900 dark:text-white">
                          {formatBalance(token.balance, token.decimals)}
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
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 text-sm sm:text-base 
            border border-gray-200 dark:border-gray-700 rounded-lg 
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
      {renderVariant()}
    </div>
  );
};
