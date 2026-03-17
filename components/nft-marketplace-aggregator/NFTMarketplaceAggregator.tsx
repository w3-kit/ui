"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ShoppingCart, BadgeCheck, ImageOff, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { NFTListing, NFTMarketplaceAggregatorProps } from "./types";
import { formatPrice, formatUSD, MOCK_LISTINGS } from "./utils";

export type { NFTListing, NFTMarketplaceAggregatorProps };

export const NFTMarketplaceAggregator: React.FC<NFTMarketplaceAggregatorProps> = ({
  initialListings,
  onBuy,
  loadingListingId,
  className,
}) => {
  const listings = initialListings || MOCK_LISTINGS;
  const [imageLoaded, setImageLoaded] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const bestPriceId = useMemo(() => {
    if (listings.length === 0) return null;
    return listings.reduce((best, l) => (l.usdPrice < best.usdPrice ? l : best), listings[0]).id;
  }, [listings]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, listing: NFTListing) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onBuy?.(listing);
      }
    },
    [onBuy]
  );

  // Empty state
  if (!listings || listings.length === 0) {
    return (
      <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
            NFT Marketplace
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <ImageOff className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No listings found</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">NFT listings will appear here when available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <p className="text-[11px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
          NFT Marketplace
        </p>
        <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {listings.map((listing) => {
          const isBestPrice = listing.id === bestPriceId && listings.length > 1;
          const isClickable = !!onBuy;
          const isLoading = loadingListingId === listing.id;

          return (
            <div
              key={listing.id}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={isClickable ? (e) => handleKeyDown(e, listing) : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors duration-150",
                "hover:bg-gray-50 dark:hover:bg-gray-900",
                isClickable && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-inset"
              )}
              onClick={() => onBuy?.(listing)}
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative">
                {!imageErrors.has(listing.id) ? (
                  <>
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className={cn(
                        "w-full h-full object-cover transition-opacity duration-150",
                        imageLoaded.has(listing.id) ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => setImageLoaded((prev) => new Set(prev).add(listing.id))}
                      onError={() => setImageErrors((prev) => new Set(prev).add(listing.id))}
                    />
                    {!imageLoaded.has(listing.id) && (
                      <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500">NFT</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{listing.name}</p>
                  {listing.verified && <BadgeCheck className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{listing.collection}</span>
                  <Badge>{listing.marketplace}</Badge>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-center justify-end gap-1.5">
                  {isBestPrice && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
                      Best
                    </span>
                  )}
                  <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{formatUSD(listing.usdPrice)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NFTMarketplaceAggregator;
