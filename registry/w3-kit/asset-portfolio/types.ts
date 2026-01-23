export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TokenConfig {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId: number;
}

export interface Asset {
  symbol: string;
  balance: string;
  price: number;
  value: number;
  change24h: number;
  color: string;
  tokenConfig: TokenConfig;
  priceHistory: {
    '24h': number[];
    '7d': number[];
    '30d': number[];
  };
  candleData?: {
    '24h': CandleData[];
    '7d': CandleData[];
    '30d': CandleData[];
  };
}

export interface AssetPortfolioProps {
  assets: Asset[];
  totalValue: number;
  totalChange24h: number;
  className?: string;
  variant?: 'default' | 'compact';
  onAssetClick?: (asset: Asset) => void;
}

export type Timeframe = '24h' | '7d' | '30d';
