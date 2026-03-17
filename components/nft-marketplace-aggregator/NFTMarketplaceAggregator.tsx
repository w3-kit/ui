"use client";

import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { NFTListing, NFTMarketplaceAggregatorProps } from "./types";
import { formatPrice, formatUSD, MOCK_LISTINGS } from "./utils";

export type { NFTListing, NFTMarketplaceAggregatorProps };

export const NFTMarketplaceAggregator: React.FC<NFTMarketplaceAggregatorProps> = ({
  initialListings,
  onBuy,
  className,
}) => {
  const listings = initialListings || MOCK_LISTINGS;
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">NFT Marketplace</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">{listings.length} listings</span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {listings.map((listing) => (
          <div key={listing.id} className="flex items-center gap-3 px-4 py-3">
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              {!imageErrors.has(listing.id) ? (
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageErrors((prev) => new Set(prev).add(listing.id))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">NFT</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{listing.name}</p>
                {listing.verified && <Check className="h-3 w-3 text-blue-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">{listing.collection}</span>
                <Badge>{listing.marketplace}</Badge>
              </div>
            </div>

            {/* Price + Buy */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">{formatPrice(listing.price, listing.currency)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatUSD(listing.usdPrice)}</p>
              {onBuy && (
                <Button onClick={() => onBuy(listing)} size="sm" variant="outline" className="mt-1.5 h-7 text-xs">
                  <ShoppingCart className="h-3 w-3" /> Buy
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTMarketplaceAggregator;
