export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface SecurityMetric {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface ProtocolRisk {
  protocol: string;
  overallScore: number;
  riskLevel: RiskLevel;
  metrics: SecurityMetric[];
  lastAudit: string;
  auditor: string;
}

export interface NFTListing {
  id: string;
  name: string;
  image: string;
  collection: string;
  marketplace: string;
  marketplaceLogo: string;
  price: number;
  currency: string;
  usdPrice: number;
  lastSale: number;
  rarity: number;
  traits: { trait: string; value: string; rarity: number }[];
  verified: boolean;
  endTime?: string;
}

export interface ProtocolRiskScannerProps {
  protocols?: ProtocolRisk[];
  className?: string;
}

export interface NFTMarketplaceAggregatorProps {
  initialListings?: NFTListing[];
  onBuy?: (listing: NFTListing) => void;
  className?: string;
}
