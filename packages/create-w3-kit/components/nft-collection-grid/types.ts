import { NFT } from '../nft-card/types';

export interface GridColumns {
  default: number;
  sm?: number;
  md?: number;
  lg?: number;
}

export interface NFTCollectionGridProps {
  nfts: NFT[];
  onNFTClick?: (nft: NFT) => void;
  onOwnerClick?: (owner: string) => void;
  className?: string;
  variant?: 'default' | 'expanded';
  columns?: GridColumns;
} 