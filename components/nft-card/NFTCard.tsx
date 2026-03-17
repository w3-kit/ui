"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { NFT, NFTCardProps } from "./types";
import { formatAddress, getChainName } from "./utils";

export type { NFT, NFTCardProps };

export function NFTCard({ nft, onNFTClick, className }: NFTCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-150 hover:border-gray-300 dark:hover:border-gray-700",
        onNFTClick && "cursor-pointer",
        className
      )}
      onClick={() => onNFTClick?.(nft)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-900">
        {!imageError ? (
          <img
            src={nft.image}
            alt={nft.name}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-150",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            No image
          </div>
        )}
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gray-100 dark:bg-gray-800" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {nft.name}
            </p>
            {nft.collection && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {nft.collection}
              </p>
            )}
          </div>
          <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 font-mono">
            #{nft.tokenId}
          </span>
        </div>

        {/* Attributes */}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {nft.attributes.slice(0, 4).map((attr, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400"
              >
                {attr.value}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {formatAddress(nft.owner)}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {getChainName(nft.chainId)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;
