export interface Asset {
  symbol: string;
  name: string;
  logoURI: string;
  balance: string;
  price: number;
  value: number;
  change24h: number;
  color: string;
  priceHistory: { "24h": number[]; "7d": number[]; "30d": number[] };
  candleData?: { "24h": never[]; "7d": never[]; "30d": never[] };
}

export interface AssetPortfolioProps {
  assets: Asset[];
  totalValue: number;
  totalChange24h: number;
  className?: string;
  onAssetClick?: (asset: Asset) => void;
}
