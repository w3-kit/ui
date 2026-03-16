"use client";

import React, { useState, useEffect, useMemo } from "react";
import { NFTCollectionGridProps, NFT } from "./types";
import { getChainName, useDebounce } from "./utils";

function NFTCardSimple({
  nft,
  onNFTClick,
  onOwnerClick,
  variant = "default",
  className = "",
}: {
  nft: NFT;
  onNFTClick?: (nft: NFT) => void;
  onOwnerClick?: (owner: string) => void;
  variant?: "default" | "expanded";
  className?: string;
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (variant === "expanded") {
    return (
      <div
        className={`bg-card rounded-xl shadow-lg overflow-hidden
          hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
          w-full max-w-full mx-auto ${className}`}
        onClick={() => onNFTClick?.(nft)}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-64 aspect-square md:aspect-auto md:h-64 overflow-hidden">
            {!isImageLoaded && !imageError && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            {!imageError ? (
              <img
                src={nft.image}
                alt={nft.name}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
              />
            ) : (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">
                  Failed to load
                </span>
              </div>
            )}
          </div>
          <div className="p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-foreground">
                {nft.name}
              </h3>
              <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-full">
                #{nft.tokenId}
              </span>
            </div>
            {nft.description && (
              <p className="text-muted-foreground mb-3 text-sm line-clamp-2">
                {nft.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {getChainName(nft.chainId)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOwnerClick?.(nft.owner);
                }}
                className="text-primary hover:text-primary-hover transition-all duration-200"
              >
                {formatAddress(nft.owner)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col ${className}`}
      onClick={() => onNFTClick?.(nft)}
    >
      <div className="relative aspect-square overflow-hidden">
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        {!imageError ? (
          <img
            src={nft.image}
            alt={nft.name}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">
              Failed to load
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground mb-2 truncate">
          {nft.name}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOwnerClick?.(nft.owner);
            }}
            className="text-sm text-primary hover:text-primary-hover transition-all duration-200 truncate max-w-[150px]"
          >
            {formatAddress(nft.owner)}
          </button>
          <span className="text-sm text-muted-foreground">
            #{nft.tokenId}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NFTCollectionGrid({
  nfts,
  onNFTClick,
  onOwnerClick,
  className = "",
  variant = "default",
}: NFTCollectionGridProps) {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "recent">("recent");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const availableChains = useMemo(() => {
    const chains = new Map();
    nfts.forEach((nft) => {
      if (nft.chainId && !chains.has(nft.chainId)) {
        chains.set(nft.chainId, {
          id: nft.chainId,
          name: getChainName(nft.chainId),
        });
      }
    });
    return Array.from(chains.values());
  }, [nfts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setIsLoading(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm]);

  const filteredNFTs = useMemo(() => {
    let result = [...nfts];

    if (debouncedSearchTerm) {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (nft) =>
          nft.name.toLowerCase().includes(lowerSearch) ||
          nft.collection?.toLowerCase().includes(lowerSearch) ||
          nft.description?.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedChain !== null) {
      result = result.filter((nft) => nft.chainId === selectedChain);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    return result;
  }, [nfts, debouncedSearchTerm, selectedChain, sortBy]);

  const handleResetFilters = () => {
    setSearchInput("");
    setSelectedChain(null);
    setSortBy("recent");
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-3 pl-10 text-sm text-foreground border border-border rounded-lg
              bg-card
              focus:ring-ring focus:border-ring transition-all duration-200"
            placeholder="Search by name, collection or description..."
            onChange={handleSearchChange}
            value={searchInput}
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Chain Filter */}
            <div className="relative inline-block">
              <select
                className="bg-card border border-border
                  text-foreground text-sm rounded-lg
                  focus:ring-ring focus:border-ring
                  p-2.5 pr-8 appearance-none cursor-pointer transition-all duration-200"
                value={selectedChain || ""}
                onChange={(e) =>
                  setSelectedChain(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">All Chains</option>
                {availableChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-muted-foreground"
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
            </div>

            {/* Sort By */}
            <div className="relative inline-block">
              <select
                className="bg-card border border-border
                  text-foreground text-sm rounded-lg
                  focus:ring-ring focus:border-ring
                  p-2.5 pr-8 appearance-none cursor-pointer transition-all duration-200"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "recent")}
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-muted-foreground"
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
            </div>
          </div>
        </div>
      </div>

      {/* Filter Information */}
      <div className="mb-6 bg-card rounded-lg border border-border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Active Filters:
          </span>

          <div className="flex flex-wrap gap-2">
            {debouncedSearchTerm && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-info-muted text-primary">
                Search: {debouncedSearchTerm}
                <button
                  onClick={() => setSearchInput("")}
                  className="ml-1.5 text-primary hover:text-primary-hover transition-all duration-200"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}

            {selectedChain !== null && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                Chain: {getChainName(selectedChain)}
                <button
                  onClick={() => setSelectedChain(null)}
                  className="ml-1.5 text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}

            {sortBy !== "recent" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-muted text-success">
                Sort: Name (A-Z)
                <button
                  onClick={() => setSortBy("recent")}
                  className="ml-1.5 text-success hover:text-success transition-all duration-200"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}

            {!debouncedSearchTerm &&
              selectedChain === null &&
              sortBy === "recent" && (
                <span className="text-sm text-muted-foreground">
                  No filters applied
                </span>
              )}
          </div>

          {(debouncedSearchTerm ||
            selectedChain !== null ||
            sortBy !== "recent") && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-sm text-destructive hover:text-destructive
                transition-colors duration-200 flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Results Count and View Mode Toggle */}
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredNFTs.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {nfts.length}
          </span>{" "}
          NFTs
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>View:</span>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-accent"
              }
                transition-colors duration-200`}
              aria-label="Grid view"
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-accent"
              }
                transition-colors duration-200`}
              aria-label="List view"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredNFTs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="w-16 h-16 text-muted-foreground mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-foreground mb-1">
            No NFTs Found
          </h3>
          <p className="text-muted-foreground max-w-md">
            We couldn&apos;t find any NFTs matching your search criteria. Try
            adjusting your filters or search term.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* NFT Grid */}
      {!isLoading && filteredNFTs.length > 0 && (
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              : "flex flex-col space-y-4"
          }`}
        >
          {filteredNFTs.map((nft) => (
            <div
              key={nft.id}
              className={`transition-all duration-500 ease-in-out transform ${
                viewMode === "list"
                  ? "w-full"
                  : "w-full hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <NFTCardSimple
                nft={nft}
                variant={viewMode === "list" ? "expanded" : variant}
                onOwnerClick={onOwnerClick}
                onNFTClick={onNFTClick}
                className={`h-full ${viewMode === "list" ? "max-w-full" : ""}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NFTCollectionGrid;
