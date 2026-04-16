export interface NFT {
  id: string;
  name: string;
  image?: string;
  collection?: string;
  tokenId?: string;
  price?: string;
  currency?: string;
  owner?: string;
  attributes?: { trait: string; value: string }[];
}

export interface NFTCardProps {
  nft: NFT;
  onClick?: (nft: NFT) => void;
  className?: string;
}
