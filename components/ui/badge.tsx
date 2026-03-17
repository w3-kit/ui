import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  success: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  error: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
