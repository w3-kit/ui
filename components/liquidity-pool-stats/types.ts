interface Token {
    symbol: string;
    logoURI: string;
    liquidity: number;
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
  }
  
  export interface LiquidityPoolStatsProps {
    poolData: {
      token: {
        symbol: string;
        logoURI: string;
        liquidity: number;
      };
      fee: number;
      tvl: number;
      tvlChange24h: number;
      volume24h: number;
      volumeChange24h: number;
      apr: number;
      feesEarned24h: number;
    };
    className?: string;
    onTokenClick?: (symbol: string) => void;
    variant?: 'default' | 'compact';
  } 