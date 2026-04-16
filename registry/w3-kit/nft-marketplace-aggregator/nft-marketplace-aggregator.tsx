"use client";

import React, { useMemo } from "react";
import { Store, BadgeCheck, ShoppingCart, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { NFTListing, NFTMarketplaceAggregatorProps } from "./types";
import { findBestPriceListing } from "./utils";

export type { NFTListing, NFTMarketplaceAggregatorProps };

export function NFTMarketplaceAggregator({
  listings,
  onBuy,
  buyingId,
  className,
}: NFTMarketplaceAggregatorProps) {
  const bestListing = useMemo(() => findBestPriceListing(listings), [listings]);

  if (!listings || listings.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 overflow-hidden",
          className,
        )}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <Store className="h-4 w-4 text-gray-400" />
          <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
            Marketplace
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <ImageOff className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-[15px] font-medium text-gray-900 dark:text-white">
            No listings found
          </p>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            NFT listings will appear here when available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-gray-400" />
          <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
            Marketplace
          </span>
        </div>
        <span className="text-[13px] text-gray-400 dark:text-gray-500 tabular-nums">
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
        </span>
      </div>

      {/* Listing rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {listings.map((listing) => {
          const isBest =
            bestListing?.id === listing.id && listings.length > 1;
          const isBuying = buyingId === listing.id;

          return (
            <div
              key={listing.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {/* 48px thumbnail */}
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                {listing.image ? (
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400 dark:text-gray-500">
                    NFT
                  </div>
                )}
              </div>

              {/* Name + collection */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[15px] font-medium text-gray-900 dark:text-white">
                    {listing.name}
                  </p>
                  {listing.verified && (
                    <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {listing.collection && (
                    <span className="text-[13px] text-gray-500 dark:text-gray-400 truncate">
                      {listing.collection}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {listing.marketplaceIcon && (
                      <img
                        src={listing.marketplaceIcon}
                        alt=""
                        className="h-3 w-3 rounded-full"
                      />
                    )}
                    {listing.marketplace}
                  </span>
                </div>
              </div>

              {/* Price + best badge */}
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  {isBest && (
                    <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-green-600 dark:bg-green-950 dark:text-green-400">
                      Best
                    </span>
                  )}
                  <span className="text-[15px] font-medium tabular-nums text-gray-900 dark:text-white">
                    {listing.price}
                    {listing.currency ? ` ${listing.currency}` : ""}
                  </span>
                </div>
                {listing.usdPrice && (
                  <span className="text-[13px] tabular-nums text-gray-500 dark:text-gray-400">
                    {listing.usdPrice}
                  </span>
                )}
              </div>

              {/* Buy button */}
              {onBuy && (
                <button
                  onClick={() => onBuy(listing)}
                  disabled={isBuying}
                  className={cn(
                    "ml-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                    isBuying
                      ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200",
                  )}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
        <p className="text-[12px] text-gray-400 dark:text-gray-500 tabular-nums">
          {listings.length} {listings.length === 1 ? "listing" : "listings"} across marketplaces
        </p>
      </div>
    </div>
  );
}

export default NFTMarketplaceAggregator;
