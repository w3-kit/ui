export interface StakingPool {
  id: string;
  name: string;
  token: string; // symbol e.g. "ETH"
  icon?: string; // logo URL
  apr: number; // percentage
  lockPeriod: number; // days
  totalStaked: string; // formatted amount
  userStaked?: string; // user's staked amount
  minStake?: string; // minimum stake
}

export interface StakingInterfaceProps {
  pools: StakingPool[];
  onStake?: (poolId: string, amount: string) => void;
  onUnstake?: (poolId: string, amount: string) => void;
  stakingPoolId?: string; // pool currently being staked to (loading)
  className?: string;
}
