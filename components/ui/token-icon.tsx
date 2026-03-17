"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface TokenIconProps {
  symbol: string;
  logoURI?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-5 h-5 text-[10px]",
  md: "w-6 h-6 text-xs",
  lg: "w-8 h-8 text-sm",
};

export function TokenIcon({ symbol, logoURI, size = "md", className }: TokenIconProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!logoURI || hasError) {
    return (
      <div
        className={cn(
          "rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-medium text-gray-500 dark:text-gray-400 flex-shrink-0",
          sizeMap[size],
          className
        )}
      >
        {symbol.substring(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn("rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 relative", sizeMap[size], className)}>
      <img
        src={logoURI}
        alt={symbol}
        className={cn(
          "w-full h-full object-contain transition-opacity duration-150",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-100 dark:bg-gray-800" />
      )}
    </div>
  );
}
