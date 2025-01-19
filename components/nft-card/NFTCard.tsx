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

  const handleOwnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOwnerClick?.(nft.owner);
  };

  const handleExplorerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getExplorerUrl(nft.chainId, nft.owner), '_blank');
  };

  if (variant === 'expanded') {
    return (
      <div 
        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}
        onClick={() => onNFTClick?.(nft)}
      >
        <div className="relative aspect-square">
          {!isImageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          {!imageError ? (
            <Image
              src={nft.image}
              alt={nft.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`transition-opacity duration-300 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">Failed to load image</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{nft.name}</h3>
              {nft.collection && (
                <p className="text-sm text-gray-500">{nft.collection}</p>
              )}
            </div>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              #{nft.tokenId}
            </span>
          </div>

          {nft.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">{nft.description}</p>
          )}

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Chain</span>
              <span className="font-medium">{getChainName(nft.chainId)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Owner</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleOwnerClick}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  {formatAddress(nft.owner)}
                </button>
                <button
                  onClick={handleExplorerClick}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {nft.attributes && nft.attributes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                {nft.attributes.map((attr, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs text-gray-500">{attr.trait_type}</p>
                    <p className="text-sm font-medium text-gray-900">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${className}`}
      onClick={() => onNFTClick?.(nft)}
    >
      <div className="relative aspect-square">
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        {!imageError ? (
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`rounded-t-lg transition-opacity duration-300 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-400">Failed to load image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{nft.name}</h3>
        <div className="flex items-center justify-between">
          <button
            onClick={handleOwnerClick}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {formatAddress(nft.owner)}
          </button>
          <span className="text-sm text-gray-500">#{nft.tokenId}</span>
        </div>
      </div>
    </div>
  );
}; 