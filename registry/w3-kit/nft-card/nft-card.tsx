"use client";

import React, { useState } from "react";
import { NFTCardProps } from "./types";
import { formatAddress, getChainName, getExplorerUrl } from "./utils";

export function NFTCard({
  nft,
  onOwnerClick,
  onNFTClick,
  className = "",
  variant = "default",
}: NFTCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleOwnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOwnerClick?.(nft.owner);
  };

  const handleExplorerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getExplorerUrl(nft.chainId, nft.owner), "_blank");
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const handleCopyName = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nft.name).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  if (variant === "expanded") {
    return (
      <>
        <div
          className={`group bg-card rounded-xl shadow-lg overflow-hidden
            hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
            w-full max-w-[500px] mx-auto ${className}`}
          onClick={() => onNFTClick?.(nft)}
        >
          <div
            className="relative aspect-square cursor-pointer overflow-hidden"
            onClick={handleImageClick}
          >
            {!isImageLoaded && !imageError && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            {!imageError ? (
              <>
                <img
                  src={nft.image}
                  alt={nft.name}
                  onLoad={() => setIsImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover transition-all duration-500 ease-in-out
                    group-hover:scale-105 transition-transform duration-300 rounded-t-lg ${
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />
                <div
                  className="absolute inset-0 bg-overlay/50 opacity-0 group-hover:opacity-100
                    transition-all duration-300 ease-in-out flex items-center justify-center
                    backdrop-blur-sm"
                >
                  <span
                    className="text-overlay-foreground font-medium text-lg
                    transform transition-all duration-300 group-hover:scale-110"
                  >
                    View
                  </span>
                </div>
              </>
            ) : (
              <div
                className="absolute inset-0 bg-muted
                flex items-center justify-center rounded-t-lg"
              >
                <span className="text-muted-foreground animate-pulse">
                  Failed to load image
                </span>
              </div>
            )}
          </div>

          <div
            className="p-4 sm:p-6 transform transition-transform duration-300
            group-hover:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="transform transition-all duration-300 hover:scale-105 relative group/copy">
                <h3
                  className="text-xl font-bold text-foreground
                  hover:text-primary
                  transition-colors duration-300 pr-8"
                >
                  {nft.name}
                  <button
                    onClick={handleCopyName}
                    className="absolute right-0 top-1/2 -translate-y-1/2
                      opacity-0 group-hover/copy:opacity-100
                      transition-all duration-200
                      text-muted-foreground hover:text-primary
                      p-1 rounded-full hover:bg-accent"
                  >
                    {copySuccess ? (
                      <svg
                        className="w-4 h-4 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
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
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    )}
                  </button>
                </h3>
                {nft.collection && (
                  <p
                    className="text-sm text-muted-foreground
                    hover:text-foreground
                    transition-colors duration-300"
                  >
                    {nft.collection}
                  </p>
                )}
              </div>
              <span
                className="text-sm text-muted-foreground
                px-3 py-1 bg-muted
                rounded-full transition-all duration-300
                hover:bg-accent"
              >
                #{nft.tokenId}
              </span>
            </div>

            {nft.description && (
              <p
                className="text-muted-foreground mb-4 line-clamp-2
                group-hover:line-clamp-none transition-all duration-500"
              >
                {nft.description}
              </p>
            )}

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chain</span>
                <span className="font-medium text-foreground">
                  {getChainName(nft.chainId)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Owner</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleOwnerClick}
                    className="text-sm text-primary
                      hover:text-primary-hover
                      transition-all duration-200 transform hover:scale-105
                      truncate max-w-[250px]"
                  >
                    {formatAddress(nft.owner)}
                  </button>
                  <button
                    onClick={handleExplorerClick}
                    className="text-muted-foreground
                      hover:text-foreground
                      transition-all duration-200 transform hover:scale-110"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {nft.attributes && nft.attributes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-2">
                  {nft.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="bg-muted p-2 rounded-lg
                        transform transition-all duration-300"
                    >
                      <p
                        className="text-xs text-muted-foreground
                        transition-colors duration-300"
                      >
                        {attr.trait_type}
                      </p>
                      <p
                        className="text-sm font-medium text-foreground
                        transition-colors duration-300"
                      >
                        {attr.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showImageModal && (
          <div
            className="fixed inset-0 bg-overlay/70 z-50
              flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="relative w-full max-w-4xl max-h-[90vh]
              rounded-lg overflow-hidden transform transition-all duration-300"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-auto object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full
                  bg-overlay/50 hover:bg-overlay/70 text-overlay-foreground
                  transition-all duration-200 transform hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
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
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`bg-card rounded-lg shadow-md overflow-hidden h-full flex flex-col ${className}`}
      onClick={() => onNFTClick?.(nft)}
    >
      <div className="relative aspect-square cursor-pointer overflow-hidden">
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
              Failed to load image
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="relative group/copy">
          <h3 className="font-semibold text-foreground mb-2 truncate pr-8">
            {nft.name}
            <button
              onClick={handleCopyName}
              className="absolute right-0 top-1/2 -translate-y-1/2
                opacity-0 group-hover/copy:opacity-100
                transition-all duration-200
                text-muted-foreground hover:text-primary
                p-1 rounded-full hover:bg-accent"
            >
              {copySuccess ? (
                <svg
                  className="w-4 h-4 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
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
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </button>
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleOwnerClick}
            className="text-sm text-primary hover:text-primary-hover transition-all duration-200 truncate max-w-[250px]"
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

export default NFTCard;
