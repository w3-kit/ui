import React, { useState } from 'react';
import Image from 'next/image';
import { NFTCardProps } from './types';
import { formatAddress, getChainName, getExplorerUrl } from './utils';

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

  const ImageModal = () => (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={() => setShowImageModal(false)}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden">
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
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 
            text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  const ImageOverlay = () => (
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
      transition-opacity duration-300 flex items-center justify-center"
    >
      <span className="text-white font-medium text-lg">View</span>
    </div>
  );

  if (variant === 'expanded') {
    return (
      <>
        <div 
          className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
            transition-shadow duration-300 w-full max-w-[500px] mx-auto ${className}`}
          onClick={() => onNFTClick?.(nft)}
        >
          <div 
            className="relative h-[300px] sm:h-[350px] cursor-pointer"
            onClick={handleImageClick}
          >
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
                  className={`transition-opacity duration-300 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <ImageOverlay />
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-t-lg">
                <span className="text-gray-400 dark:text-gray-500">Failed to load image</span>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{nft.name}</h3>
                {nft.collection && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</p>
                )}
              </div>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
                #{nft.tokenId}
              </span>
            </div>

            {nft.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{nft.description}</p>
            )}

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Chain</span>
                <span className="font-medium text-gray-900 dark:text-white">{getChainName(nft.chainId)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Owner</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleOwnerClick}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {formatAddress(nft.owner)}
                  </button>
                  <button
                    onClick={handleExplorerClick}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {nft.attributes && nft.attributes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  {nft.attributes.map((attr, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{attr.trait_type}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showImageModal && <ImageModal />}
      </>
    );
  }

  return (
    <>
      <div 
        className={`group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md 
          transition-shadow w-full max-w-[500px] mx-auto ${className}`}
        onClick={() => onNFTClick?.(nft)}
      >
        <div 
          className="relative h-[300px] sm:h-[350px] cursor-pointer"
          onClick={handleImageClick}
        >
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
                className={`rounded-t-lg transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <ImageOverlay />
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-t-lg">
              <span className="text-gray-400 dark:text-gray-500">Failed to load image</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">{nft.name}</h3>
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

      {showImageModal && <ImageModal />}
    </>
  );
}; 