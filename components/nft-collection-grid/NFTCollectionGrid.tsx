import React, { useState } from 'react';
import { NFTCard } from '../nft-card/NFTCard';
import { NFTCollectionGridProps } from './types';

export const NFTCollectionGrid: React.FC<NFTCollectionGridProps> = ({
  nfts,
  onNFTClick,
  onOwnerClick,
  className = '',
  variant = 'default',
}) => {
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap gap-4 sm:gap-6">
        {nfts.map((nft) => (
          <div 
            key={nft.id}
            className={`w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] flex-grow basis-[200px] ${
              selectedNFT === nft.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
            }`}
          >
            <NFTCard
              nft={nft}
              variant={variant}
              onNFTClick={(nft) => {
                setSelectedNFT(nft.id);
                onNFTClick?.(nft);
              }}
              onOwnerClick={onOwnerClick}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
