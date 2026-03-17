import { VestingSchedule } from "./types";

export function calculateProgress(schedule: VestingSchedule): number {
  const total = schedule.endDate - schedule.startDate;
  const current = Date.now() - schedule.startDate;
  return Math.min(Math.max((current / total) * 100, 0), 100);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function isClaimable(schedule: VestingSchedule): boolean {
  return schedule.status === "active" && Date.now() >= schedule.cliffDate && parseFloat(schedule.vestedAmount) < parseFloat(schedule.totalAmount);
}
