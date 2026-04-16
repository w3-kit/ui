export interface NFTListing {
  id: string;
  name: string;
  image?: string;
  collection?: string;
  marketplace: string;
  marketplaceIcon?: string;
  price: string;
  currency?: string;
  usdPrice?: string;
  verified?: boolean;
}

export interface NFTMarketplaceAggregatorProps {
  listings: NFTListing[];
  onBuy?: (listing: NFTListing) => void;
  buyingId?: string;
  className?: string;
}
