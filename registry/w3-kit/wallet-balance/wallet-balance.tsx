"use client";

import React, { useState } from "react";
import { RefreshCw, Search, X, Send, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Token, WalletBalanceProps, SortOption } from "./types";
import { formatBalance, formatCurrency } from "./utils";

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  tokens,
  onTokenClick,
  className = "",
  variant = "default",
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("value");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showAllTokens, setShowAllTokens] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const totalValue = tokens.reduce(
    (sum, token) => sum + Number(token.balance) * (token.price || 0),
    0
  );

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("desc");
    }
  };

  const handleTokenClick = (token: Token) => {
    setSelectedToken(selectedToken?.symbol === token.symbol ? null : token);
    onTokenClick?.(token);
  };

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "balance":
        comparison = Number(a.balance) - Number(b.balance);
        break;
      case "value":
        comparison =
          Number(a.balance) * (a.price || 0) -
          Number(b.balance) * (b.price || 0);
        break;
      case "change":
        comparison = (a.priceChange24h || 0) - (b.priceChange24h || 0);
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const displayTokens =
    variant === "compact" && !showAllTokens
      ? sortedTokens.slice(0, 3)
      : sortedTokens;

  const getPriceChangeBadgeVariant = (change: number | undefined) => {
    if (change === undefined) return "secondary";
    if (change > 0) return "success";
    if (change < 0) return "destructive";
    return "secondary";
  };

  if (variant === "compact") {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="p-3 sm:p-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg">Wallet Balance</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-bold">
                {formatCurrency(totalValue)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4">
          <div className="relative mb-3">
            <Input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {displayTokens.map((token) => {
              const tokenValue = Number(token.balance) * (token.price || 0);
              const isSelected = selectedToken?.symbol === token.symbol;

              return (
                <div
                  key={token.symbol}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                    !isSelected && "hover:bg-accent"
                  )}
                  onClick={() => handleTokenClick(token)}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="rounded-full w-6 h-6 sm:w-7 sm:h-7 object-contain bg-background"
                      />
                      {token.priceChange24h !== undefined && (
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full",
                            token.priceChange24h > 0 && "bg-green-500",
                            token.priceChange24h < 0 && "bg-red-500",
                            token.priceChange24h === 0 && "bg-muted-foreground"
                          )}
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-[150px]">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm sm:text-base">
                      {formatBalance(token.balance, token.decimals)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(tokenValue)}
                    </div>
                  </div>
                </div>
              );
            })}

            {sortedTokens.length === 0 && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No tokens found
              </div>
            )}

            {sortedTokens.length > 3 && (
              <Button
                variant="ghost"
                onClick={() => setShowAllTokens(!showAllTokens)}
                className="w-full text-xs"
              >
                {showAllTokens ? "Show Less" : `Show All (${sortedTokens.length})`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Total Balance</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
          </Button>
        </div>
        <div className="text-2xl sm:text-3xl font-bold">
          {formatCurrency(totalValue)}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {tokens.length} tokens in wallet
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
            {(["value", "name", "balance", "change"] as const).map((option) => (
              <Button
                key={option}
                variant={sortBy === option ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort(option)}
                className="text-xs capitalize"
              >
                {option === "change" ? "24h" : option}{" "}
                {sortBy === option && (sortDirection === "asc" ? "↑" : "↓")}
              </Button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-border max-h-[300px] sm:max-h-[400px] overflow-y-auto -mx-6 px-6">
          {sortedTokens.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No tokens found matching your search
            </div>
          ) : (
            sortedTokens.map((token) => {
              const tokenValue = Number(token.balance) * (token.price || 0);
              const isSelected = selectedToken?.symbol === token.symbol;

              return (
                <div
                  key={token.symbol}
                  className={cn(
                    "py-3 sm:py-4 cursor-pointer transition-colors",
                    !isSelected && "hover:bg-accent/50"
                  )}
                  onClick={() => handleTokenClick(token)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="relative">
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 object-contain bg-background"
                        />
                        {token.priceChange24h !== undefined && (
                          <div
                            className={cn(
                              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full",
                              token.priceChange24h > 0 && "bg-green-500",
                              token.priceChange24h < 0 && "bg-red-500",
                              token.priceChange24h === 0 && "bg-muted-foreground"
                            )}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">
                          {token.name}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                          <span>{token.symbol}</span>
                          {token.priceChange24h !== undefined && (
                            <Badge variant={getPriceChangeBadgeVariant(token.priceChange24h)} className="text-xs">
                              {token.priceChange24h > 0 ? "+" : ""}
                              {token.priceChange24h.toFixed(2)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="font-medium text-sm sm:text-base">
                        {formatBalance(token.balance, token.decimals)}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {formatCurrency(tokenValue)}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t">
                      <Card className="bg-muted/50">
                        <CardContent className="p-3 grid grid-cols-2 gap-4 text-sm">
                          <div className="border-r pr-3">
                            <div className="text-muted-foreground mb-1 text-xs">
                              Price
                            </div>
                            <div className="font-medium">
                              {formatCurrency(token.price || 0)}
                            </div>
                          </div>
                          <div className="pl-3">
                            <div className="text-muted-foreground mb-1 text-xs">
                              Value
                            </div>
                            <div className="font-medium">
                              {formatCurrency(tokenValue)}
                            </div>
                          </div>
                          {token.priceChange24h !== undefined && (
                            <div className="col-span-2 border-t pt-2 mt-1">
                              <div className="text-muted-foreground mb-1 text-xs">
                                24h Change
                              </div>
                              <Badge variant={getPriceChangeBadgeVariant(token.priceChange24h)}>
                                {token.priceChange24h > 0 ? "+" : ""}
                                {token.priceChange24h.toFixed(2)}%
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Send ${token.symbol} functionality would go here`);
                          }}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Swap ${token.symbol} functionality would go here`);
                          }}
                        >
                          <ArrowLeftRight className="h-3 w-3 mr-1" />
                          Swap
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
