"use client";

import React from "react";
import { cn } from "../../lib/utils";
import { NFTCard } from "../nft-card/NFTCard";
import { NFT, NFTCollectionGridProps } from "./types";

export type { NFT, NFTCollectionGridProps };

export const NFTCollectionGrid: React.FC<NFTCollectionGridProps> = ({
  nfts,
  onNFTClick,
  className,
}) => {
  if (nfts.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-12 text-center",
          className
        )}
      >
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No NFTs found
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {nfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} onNFTClick={onNFTClick} />
      ))}
    </div>
  );
};

export default NFTCollectionGrid;
