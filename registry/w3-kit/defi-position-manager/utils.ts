import { PositionData } from './types';

// Get health factor color based on value
export const getHealthFactorColor = (healthFactor: number): string => {
  if (healthFactor >= 2) return "text-green-500 dark:text-green-400";
  if (healthFactor >= 1.5) return "text-yellow-500 dark:text-yellow-400";
  return "text-red-500 dark:text-red-400";
};

// Get risk color based on risk level
export const getRiskColor = (risk: PositionData["risk"]): string => {
  switch (risk) {
    case "low":
      return "text-green-500 dark:text-green-400";
    case "medium":
      return "text-yellow-500 dark:text-yellow-400";
    case "high":
      return "text-red-500 dark:text-red-400";
  }
};

// Calculate total value of all positions
export const calculateTotalValue = (positions: PositionData[]): number => {
  return positions.reduce((sum, pos) => sum + pos.value, 0);
};

// Animation constants
export const cardAnimation = "hover:shadow-lg transition-all duration-200 hover:scale-[1.02]";
export const buttonAnimation = "transition-colors";
export const modalAnimation = "animate-fadeIn";
export const modalContentAnimation = "animate-slideIn";
