export interface PoolData {
  token: { symbol: string; logoURI: string; price: number; marketCap: number };
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
}
