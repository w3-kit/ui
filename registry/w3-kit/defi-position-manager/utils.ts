import { PositionData } from './types';

// Get health factor color based on value
export const getHealthFactorColor = (healthFactor: number): string => {
  if (healthFactor >= 2) return "text-success";
  if (healthFactor >= 1.5) return "text-warning";
  return "text-destructive";
};

// Get risk color based on risk level
export const getRiskColor = (risk: PositionData["risk"]): string => {
  switch (risk) {
    case "low":
      return "text-success";
    case "medium":
      return "text-warning";
    case "high":
      return "text-destructive";
  }
};

// Calculate total value of all positions
export const calculateTotalValue = (positions: PositionData[]): number => {
  return positions.reduce((sum, pos) => sum + pos.value, 0);
};

// Animation constants
export const cardAnimation = "hover:shadow-lg transition-all duration-200 hover:scale-[1.02]";
export const buttonAnimation = "transition-all duration-200";
export const modalAnimation = "animate-fadeIn";
export const modalContentAnimation = "animate-slideIn";
