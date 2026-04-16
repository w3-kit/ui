"use client";

import React, { useCallback } from "react";
import { Image, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { NFTCardProps } from "./types";
import { truncateAddress } from "./utils";

export function NFTCard({ nft, onClick, className }: NFTCardProps) {
  const isClickable = !!onClick;

  const handleClick = useCallback(() => {
    onClick?.(nft);
  }, [onClick, nft]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(nft);
      }
    },
    [onClick, nft],
  );

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        "overflow-hidden transition-all duration-200",
        isClickable &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {nft.image ? (
          <img
            src={nft.image}
            alt={nft.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <Image className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {nft.collection && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <Tag className="h-3 w-3" />
            {nft.collection}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-3">
        <p className="truncate text-[15px] font-medium text-gray-900 dark:text-white">
          {nft.name}
        </p>

        {(nft.price || nft.tokenId) && (
          <div className="mt-1 flex items-center justify-between">
            {nft.price && (
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {nft.price}
                {nft.currency && (
                  <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                    {nft.currency}
                  </span>
                )}
              </span>
            )}
            {nft.tokenId && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                #{nft.tokenId}
              </span>
            )}
          </div>
        )}

        {nft.owner && (
          <p className="mt-2 truncate font-mono text-xs text-gray-400 dark:text-gray-500">
            {truncateAddress(nft.owner)}
          </p>
        )}

        {nft.attributes && nft.attributes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {nft.attributes.slice(0, 4).map((attr, i) => (
              <span
                key={i}
                className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                <span className="mr-1 text-gray-400 dark:text-gray-500">
                  {attr.trait}:
                </span>
                {attr.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NFTCard;
