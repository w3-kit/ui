"use client";

import React from "react";
import { ImageOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { NFTCard } from "../nft-card/NFTCard";
import { NFT, NFTCollectionGridProps } from "./types";

export type { NFT, NFTCollectionGridProps };

export const NFTCollectionGrid: React.FC<NFTCollectionGridProps> = ({
  nfts,
  collectionName,
  onNFTClick,
  className,
}) => {
  // Empty state
  if (!nfts || nfts.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
          className
        )}
      >
        {collectionName && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
              {collectionName}
            </p>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <ImageOff className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No NFTs found</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This collection is empty or hasn&apos;t been loaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {collectionName && (
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
            {collectionName}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {nfts.length} {nfts.length === 1 ? "item" : "items"}
          </span>
        </div>
      )}

      {/* Grid */}
      <div
        className={cn(
          "grid gap-4",
          nfts.length === 1 && "grid-cols-1 max-w-sm",
          nfts.length === 2 && "grid-cols-1 sm:grid-cols-2",
          nfts.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} onNFTClick={onNFTClick} />
        ))}
      </div>
    </div>
  );
};

export default NFTCollectionGrid;
