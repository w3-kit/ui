export interface Airdrop {
  id: string;
  token: string;
  amount: string;
  status: "active" | "claimed" | "expired";
  startDate: string;
  endDate: string;
}

export interface TokenAirdropProps {
  airdrops: Airdrop[];
  onClaim?: (airdropId: string) => void;
  claimingId?: string;
  className?: string;
}
