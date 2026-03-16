"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressRootVariants = cva(
  "relative w-full overflow-hidden rounded-full",
  {
    variants: {
      color: {
        default: "bg-primary/20",
        success: "bg-success/20",
        warning: "bg-warning/20",
        destructive: "bg-destructive/20",
        info: "bg-info/20",
      },
      progressSize: {
        xs: "h-1",
        sm: "h-1.5",
        default: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
    },
    defaultVariants: {
      color: "default",
      progressSize: "default",
    },
  }
);

const progressIndicatorColors = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
} as const;

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressRootVariants> {
  indeterminate?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, color, progressSize, indeterminate, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressRootVariants({ color, progressSize, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full flex-1 transition-all",
        progressIndicatorColors[color ?? "default"],
        indeterminate ? "w-1/3 animate-indeterminate" : "w-full"
      )}
      style={
        indeterminate
          ? undefined
          : { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
