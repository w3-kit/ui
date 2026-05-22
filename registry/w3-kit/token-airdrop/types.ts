export interface Airdrop {
  id: string;
  token: string;
  amount: string;
  status: "active" | "claimed" | "expired";
  startDate: string;
  endDate: string;
  /** Optional display name shown above the amount line */
  name?: string;
  /** Optional token logo URL */
  logoURI?: string;
}

export interface TokenAirdropProps {
  airdrops: Airdrop[];
  onClaim?: (airdropId: string) => void;
  claimingId?: string;
  /** Show footer with airdrop count */
  showFooter?: boolean;
  /** Show count of active airdrops in the header (instead of total) */
  showActiveCount?: boolean;
  className?: string;
}
