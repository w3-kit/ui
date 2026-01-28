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

export interface NFTCardProps {
  nft: NFT;
  onOwnerClick?: (owner: string) => void;
  onNFTClick?: (nft: NFT) => void;
  className?: string;
  variant?: "default" | "expanded";
}
