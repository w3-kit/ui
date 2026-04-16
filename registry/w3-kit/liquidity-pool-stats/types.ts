export interface PoolStats {
  tokenPair: string; // e.g. "ETH / USDC"
  fee: string; // e.g. "0.30%"
  tvl: number;
  tvlChange24h?: number;
  volume24h: number;
  volumeChange24h?: number;
  apr: number;
  feesEarned24h?: number;
  transactions24h?: number;
  holders?: number;
}

export interface LiquidityPoolStatsProps {
  pool: PoolStats;
  onAddLiquidity?: () => void;
  onRemoveLiquidity?: () => void;
  className?: string;
}
