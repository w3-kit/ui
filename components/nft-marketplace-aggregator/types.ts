export interface NFTListing {
  id: string;
  name: string;
  image: string;
  collection: string;
  marketplace: string;
  price: number;
  currency: string;
  usdPrice: number;
  verified: boolean;
}

export interface NFTMarketplaceAggregatorProps {
  initialListings?: NFTListing[];
  onBuy?: (listing: NFTListing) => void;
  loadingListingId?: string;
  className?: string;
}
