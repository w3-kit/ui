export interface StakingPool {
  id: string;
  name: string;
  token: { symbol: string; logoURI: string; decimals: number };
  apr: number;
  minStake: string;
  lockPeriod: number;
  totalStaked: string;
}

export interface StakingInterfaceProps {
  pools: StakingPool[];
  onStake?: (poolId: string, amount: string) => void;
  onUnstake?: (poolId: string, amount: string) => void;
  loadingPoolId?: string;
  className?: string;
}
