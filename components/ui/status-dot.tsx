import React from "react";
import { cn } from "../../lib/utils";

interface StatusDotProps {
  status: "success" | "pending" | "error";
  className?: string;
}

const statusStyles = {
  success: "bg-green-500",
  pending: "bg-amber-500",
  error: "bg-red-500",
};

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full flex-shrink-0",
        statusStyles[status],
        className,
      )}
    />
  );
}
