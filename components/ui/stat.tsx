import React from "react";
import { cn } from "../../lib/utils";

interface StatProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function Stat({ label, value, className }: StatProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
