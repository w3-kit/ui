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

export interface NFTCollectionGridProps {
  nfts: NFT[];
  collectionName?: string;
  onNFTClick?: (nft: NFT) => void;
  className?: string;
}
