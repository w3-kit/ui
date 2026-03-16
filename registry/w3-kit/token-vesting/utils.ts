import { VestingSchedule } from "./types";

export function calculateProgress(schedule: VestingSchedule): number {
  const now = Date.now();
  const total = schedule.endDate - schedule.startDate;
  const current = now - schedule.startDate;
  return Math.min(Math.max((current / total) * 100, 0), 100);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isClaimable(schedule: VestingSchedule): boolean {
  const now = Date.now();
  return (
    schedule.status === "active" &&
    now >= schedule.cliffDate &&
    parseFloat(schedule.vestedAmount) < parseFloat(schedule.totalAmount)
  );
}

export const statusConfig = {
  active: {
    bg: "bg-success-muted",
    text: "text-success",
    label: "Active",
  },
  completed: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Completed",
  },
  pending: {
    bg: "bg-warning-muted",
    text: "text-warning",
    label: "Pending",
  },
};

export const animationStyles = `
  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
