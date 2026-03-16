import { AirdropInfo, AirdropStatus } from "./types";

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isAirdropActive(airdrop: AirdropInfo): boolean {
  const now = Date.now();
  return now >= airdrop.startTime && now <= airdrop.endTime && !airdrop.claimed;
}

export function getAirdropStatus(airdrop: AirdropInfo): AirdropStatus {
  const now = Date.now();
  if (airdrop.claimed) return "claimed";
  if (now < airdrop.startTime) return "upcoming";
  if (now > airdrop.endTime) return "expired";
  return "active";
}

export const statusConfig = {
  active: {
    bg: "bg-success-muted",
    text: "text-success",
    label: "Active",
  },
  claimed: {
    bg: "bg-info-muted",
    text: "text-primary",
    label: "Claimed",
  },
  expired: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Expired",
  },
  upcoming: {
    bg: "bg-warning-muted",
    text: "text-warning",
    label: "Upcoming",
  },
};

export const animationStyles = `
  @keyframes success-circle {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes success-check {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes success-fill {
    0% { opacity: 0; }
    100% { opacity: 0.2; }
  }

  .animate-success-circle {
    animation: success-circle 0.4s ease-out forwards;
  }

  .animate-success-check {
    stroke-dasharray: 100;
    animation: success-check 0.6s ease-out 0.2s forwards;
  }

  .animate-success-fill {
    animation: success-fill 0.4s ease-out 0.4s forwards;
    background: currentColor;
  }
`;
