export interface StakingPool {
  id: string;
  name: string;
  token: {
    symbol: string;
    logoURI: string;
    decimals: number;
  };
  apr: number;
  minStake: string;
  lockPeriod: number; // in days
  totalStaked: string;
  isStaked?: boolean; // Track if user has staked this token
}

export interface StakingInterfaceProps {
  pools: StakingPool[];
  userBalance?: string;
  onStake?: (poolId: string, amount: string) => void;
  onUnstake?: (poolId: string, amount: string) => void;
  className?: string;
  variant?: "default" | "compact";
}
