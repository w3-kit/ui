export interface NFTItem {
  id: string;
  name: string;
  image?: string;
  price?: string;
  currency?: string;
}

export interface NFTCollectionGridProps {
  items: NFTItem[];
  collectionName?: string;
  onItemClick?: (item: NFTItem) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}
