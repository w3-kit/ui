import React, { useState } from 'react';
import Image from 'next/image';
import { NFTCardProps } from './types';
import { formatAddress, getChainName, getExplorerUrl } from './utils';

const styles = {
  cardWrapper: `
    group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
    hover:shadow-xl transition-all duration-300 
    transform hover:-translate-y-1
    w-full max-w-[500px] mx-auto
  `,
  imageContainer: `
    relative aspect-square cursor-pointer
    overflow-hidden
  `,
  imageOverlay: `
    absolute inset-0 bg-black/50 
    opacity-0 group-hover:opacity-100 
    transition-all duration-300 ease-in-out
    flex items-center justify-center
    backdrop-blur-sm
  `,
  image: `
    transition-all duration-500 ease-in-out
    group-hover:scale-105
    rounded-t-lg
  `,
  infoSection: `
    p-4 sm:p-6
    transform transition-transform duration-300
    group-hover:scale-[0.98]
  `,
  attributeTag: `
    bg-gray-50 dark:bg-gray-700 p-2 rounded-lg
    transform transition-all duration-300
    
  `,
  ownerButton: `
    text-sm text-blue-600 dark:text-blue-400 
    hover:text-blue-800 dark:hover:text-blue-300 
    transition-all duration-300
    transform hover:scale-105
    truncate max-w-[250px]
  `,
  tokenId: `
    text-sm text-gray-500 dark:text-gray-400
    px-3 py-1 bg-gray-100 dark:bg-gray-700 
    rounded-full transition-all duration-300
    hover:bg-gray-200 dark:hover:bg-gray-600
  `,
  statsValue: `
    font-medium text-gray-900 dark:text-white
  `,
  statsLabel: `
    text-gray-500 dark:text-gray-400
  `
};

export const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  onOwnerClick,
  onNFTClick,
  className = '',
  variant = 'default'
}) => {
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
    window.open(getExplorerUrl(nft.chainId, nft.owner), '_blank');
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

  if (variant === 'expanded') {
    return (
      <>
        <div className={`${styles.cardWrapper} ${className}`} onClick={() => onNFTClick?.(nft)}>
          <div className={styles.imageContainer} onClick={handleImageClick}>
            {!isImageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse" />
            )}
            {!imageError ? (
              <>
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 500px"
                  style={{ objectFit: 'cover' }}
                  onLoad={() => setIsImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`${styles.image} ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className={styles.imageOverlay}>
                  <span className="text-white font-medium text-lg 
                    transform transition-all duration-300 
                    group-hover:scale-110">
                    View
                  </span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 
                flex items-center justify-center rounded-t-lg">
                <span className="text-gray-400 dark:text-gray-500 animate-pulse">
                  Failed to load image
                </span>
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className="flex items-center justify-between mb-4">
              <div className="transform transition-all duration-300 hover:scale-105 relative group/copy">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white 
                  hover:text-blue-600 dark:hover:text-blue-400 
                  transition-colors duration-300 pr-8">
                  {nft.name}
                  <button
                    onClick={handleCopyName}
                    className="absolute right-0 top-1/2 -translate-y-1/2
                      opacity-0 group-hover/copy:opacity-100
                      transition-all duration-300
                      text-gray-400 hover:text-blue-500
                      p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {copySuccess ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </h3>
                {copySuccess && (
                  <div className="absolute -right-2 top-8 
                    bg-black/75 text-white text-xs px-2 py-1 rounded
                    transform -translate-y-1 opacity-0 animate-fadeInOut">
                    Copied!
                  </div>
                )}
                {nft.collection && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 
                    hover:text-gray-700 dark:hover:text-gray-300 
                    transition-colors duration-300">
                    {nft.collection}
                  </p>
                )}
              </div>
              <span className={styles.tokenId}>#{nft.tokenId}</span>
            </div>

            {nft.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 
                group-hover:line-clamp-none transition-all duration-500">
                {nft.description}
              </p>
            )}

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={styles.statsLabel}>Chain</span>
                <span className={styles.statsValue}>
                  {getChainName(nft.chainId)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={styles.statsLabel}>Owner</span>
                <div className="flex items-center space-x-2">
                  <button onClick={handleOwnerClick} className={styles.ownerButton}>
                    {formatAddress(nft.owner)}
                  </button>
                  <button
                    onClick={handleExplorerClick}
                    className="text-gray-400 dark:text-gray-500 
                      hover:text-gray-600 dark:hover:text-gray-300 
                      transition-all duration-300 transform hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {nft.attributes && nft.attributes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  {nft.attributes.map((attr, index) => (
                    <div key={index} className={styles.attributeTag}>
                      <p className="text-xs text-gray-500 dark:text-gray-400 
                        transition-colors duration-300">
                        {attr.trait_type}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white 
                        transition-colors duration-300">
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
            className="fixed inset-0 bg-black/70 z-50 
              flex items-center justify-center p-4
              animate-fadeIn backdrop-blur-sm"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] 
              rounded-lg overflow-hidden
              transform transition-all duration-300
              animate-scaleIn">
              <Image
                src={nft.image}
                alt={nft.name}
                width={1200}
                height={1200}
                className="w-full h-auto object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full 
                  bg-black/50 hover:bg-black/70 text-white
                  transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" />
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
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col ${className}`}
      onClick={() => onNFTClick?.(nft)}
    >
      <div className={styles.imageContainer}>
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse" />
        )}
        {!imageError ? (
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            sizes="(max-width: 640px) 100vw, 500px"
            style={{ objectFit: 'cover' }}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`${isImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">Failed to load image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="relative group/copy">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate pr-8">
            {nft.name}
            <button
              onClick={handleCopyName}
              className="absolute right-0 top-1/2 -translate-y-1/2
                opacity-0 group-hover/copy:opacity-100
                transition-all duration-300
                text-gray-400 hover:text-blue-500
                p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {copySuccess ? (
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
          </h3>
          {copySuccess && (
            <div className="absolute -right-2 top-8 
              bg-black/75 text-white text-xs px-2 py-1 rounded
              transform -translate-y-1 opacity-0 animate-fadeInOut">
              Copied!
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleOwnerClick}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate max-w-[250px]"
          >
            {formatAddress(nft.owner)}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">#{nft.tokenId}</span>
        </div>
      </div>
    </div>
  );
}; 