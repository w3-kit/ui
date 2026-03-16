import { FlashLoanData } from './types';

// Get risk color based on risk level
export const getRiskColor = (risk: FlashLoanData["risk"]): string => {
  switch (risk) {
    case "low":
      return "text-success";
    case "medium":
      return "text-warning";
    case "high":
      return "text-destructive";
  }
};

// Animation constants
export const buttonAnimation = "transition-colors";
export const selectionAnimation = "transition-colors";
