export interface NFT {
  id: string;
  name: string;
  description?: string;
  image: string;
  owner: string;
  collection?: string;
  tokenId: string;
  contractAddress: string;
  chainId: number;
  attributes?: {
    trait_type: string;
    value: string | number;
  }[];
}

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
  variant?: "default" | "expanded";
  columns?: GridColumns;
}
