export interface VestingSchedule {
  id: string;
  tokenSymbol: string;
  totalAmount: string;
  vestedAmount: string;
  startDate: number;
  endDate: number;
  cliffDate: number;
  lastClaimDate: number | null;
  beneficiary: string;
  status: "active" | "completed" | "pending";
}

export interface TokenVestingProps {
  vestingSchedules: VestingSchedule[];
  onClaimTokens: (scheduleId: string) => Promise<void>;
  className?: string;
}
