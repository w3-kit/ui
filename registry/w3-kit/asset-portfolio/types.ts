export interface Asset {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  color?: string;
  logoURI?: string;
}

export interface AssetPortfolioProps {
  assets: Asset[];
  totalValue: number;
  totalChange24h: number;
  onAssetClick?: (asset: Asset) => void;
  showAllocation?: boolean;
  className?: string;
}
