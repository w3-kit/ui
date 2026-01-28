import { FlashLoanData } from './types';

// Get risk color based on risk level
export const getRiskColor = (risk: FlashLoanData["risk"]): string => {
  switch (risk) {
    case "low":
      return "text-green-500 dark:text-green-400";
    case "medium":
      return "text-yellow-500 dark:text-yellow-400";
    case "high":
      return "text-red-500 dark:text-red-400";
  }
};

// Animation constants
export const buttonAnimation = "transition-colors";
export const selectionAnimation = "transition-colors";
