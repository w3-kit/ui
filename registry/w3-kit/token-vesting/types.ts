export interface VestingSchedule {
  id: string;
  token: string;
  totalAmount: string;
  vestedAmount: string;
  cliffDate: string;
  endDate: string;
  status: "active" | "completed" | "pending";
  /** Optional currently-claimable amount; surfaces a labeled claim CTA */
  claimableAmount?: string;
  /** Optional token logo URL */
  logoURI?: string;
}

export interface TokenVestingProps {
  schedules: VestingSchedule[];
  onClaim?: (scheduleId: string) => void;
  claimingId?: string;
  /** Show count badge next to the title */
  showCount?: boolean;
  /** Show progress bar labels (% vested / remaining) */
  showProgressLabels?: boolean;
  /** Show footer with schedules count */
  showFooter?: boolean;
  className?: string;
}
