export interface VestingSchedule {
  id: string;
  token: string;
  totalAmount: string;
  vestedAmount: string;
  cliffDate: string;
  endDate: string;
  status: "active" | "completed" | "pending";
}

export interface TokenVestingProps {
  schedules: VestingSchedule[];
  onClaim?: (scheduleId: string) => void;
  claimingId?: string;
  className?: string;
}
