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
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-400",
    label: "Active",
  },
  completed: {
    bg: "bg-gray-100 dark:bg-gray-900/30",
    text: "text-gray-800 dark:text-gray-400",
    label: "Completed",
  },
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-400",
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
