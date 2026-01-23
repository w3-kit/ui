export interface AirdropInfo {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
  amount: string;
  merkleRoot: string;
  merkleProof: string[];
  startTime: number;
  endTime: number;
  claimed: boolean;
  logoURI?: string;
}

export interface TokenAirdropProps {
  airdrops: AirdropInfo[];
  onClaim: (airdropId: string) => Promise<void>;
}

export type AirdropStatus = "active" | "claimed" | "expired" | "upcoming";
