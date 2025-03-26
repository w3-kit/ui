export interface Token {
  symbol: string;
  logoURI: string;
  liquidity: number;
  price: number;
  marketCap: number;
  totalSupply: number;
  circulatingSupply: number;
}

export interface PoolData {
  token: Token;
  fee: number;
  tvl: number;
  tvlChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  apr: number;
  feesEarned24h: number;
  uniqueHolders: number;
  transactions24h: number;
}

export interface LiquidityPoolStatsProps {
  poolData: PoolData;
  className?: string;
  onTokenClick?: (symbol: string) => void;
  variant?: 'default' | 'compact';
  isLoading?: boolean;
} 