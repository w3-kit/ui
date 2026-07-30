"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TokenCreateStep, StepDescriptor } from "./types";

export interface ProgressProps {
  steps: StepDescriptor[];
  /** Active step; previous steps render as completed. */
  current: TokenCreateStep;
  className?: string;
}

export function Progress({ steps, current, className }: ProgressProps) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <ol
      aria-label="Token creation progress"
      className={cn("flex w-full items-center gap-2", className)}
    >
      {steps.map((step, idx) => {
        const isComplete = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <li
            key={step.id}
            aria-current={isCurrent ? "step" : undefined}
            className="flex flex-1 items-center gap-2"
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                isComplete && "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
                isCurrent && "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
                !isComplete &&
                  !isCurrent &&
                  "border border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500",
              )}
              aria-hidden="true"
            >
              {isComplete ? <Check size={12} /> : idx + 1}
            </span>
            <span
              className={cn(
                "hidden truncate text-xs font-medium sm:inline",
                isCurrent
                  ? "text-gray-900 dark:text-gray-100"
                  : isComplete
                    ? "text-gray-600 dark:text-gray-400"
                    : "text-gray-400 dark:text-gray-500",
              )}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <span
                className={cn(
                  "mx-1 h-px flex-1",
                  idx < currentIndex
                    ? "bg-gray-900 dark:bg-white"
                    : "bg-gray-200 dark:bg-gray-800",
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export interface PendingOverlayProps {
  /** Human-readable status, e.g. "Awaiting wallet signature…". */
  message: string;
  /** Set true once the deploy result has been written. */
  complete: boolean;
  className?: string;
}

export function PendingOverlay({ message, complete, className }: PendingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center gap-3 py-8 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        {complete ? (
          <Check size={20} className="text-green-600 dark:text-green-400" />
        ) : (
          <Loader2 size={20} className="animate-spin text-gray-700 dark:text-gray-300" />
        )}
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {complete ? "Transaction confirmed" : message}
      </p>
      {!complete && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Don't close this tab.
        </p>
      )}
    </div>
  );
}
