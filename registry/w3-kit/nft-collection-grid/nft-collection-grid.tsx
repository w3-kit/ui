"use client";

import React from "react";
import { Grid3X3, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { NFTCollectionGridProps } from "./types";

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
} as const;

export function NFTCollectionGrid({
  items,
  collectionName,
  onItemClick,
  columns = 2,
  className,
}: NFTCollectionGridProps) {
  if (!items || items.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
          className,
        )}
      >
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <ImageOff className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No items found</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This collection is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {collectionName ?? "Collection"}
          </span>
        </div>
        <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Grid */}
      <div className={cn("grid gap-4 p-5", columnClasses[columns])}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick?.(item)}
            className={cn(
              "group rounded-xl border border-gray-100 bg-gray-50 text-left",
              "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
              "dark:border-gray-800 dark:bg-gray-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
            )}
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden rounded-t-xl">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <ImageOff className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {item.name}
              </p>
              {item.price && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {item.price} {item.currency ?? "ETH"}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Showing {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>
    </div>
  );
}

export default NFTCollectionGrid;
