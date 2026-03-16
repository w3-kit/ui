import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-transparent px-3 shadow-sm transition-all duration-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input focus-visible:ring-ring",
        error:
          "border-destructive focus-visible:ring-destructive aria-[invalid]:border-destructive",
        warning:
          "border-warning focus-visible:ring-warning",
        success:
          "border-success focus-visible:ring-success",
      },
      inputSize: {
        xs: "h-7 px-2 py-1 text-xs",
        sm: "h-8 px-2.5 py-1 text-xs",
        default: "h-9 px-3 py-1 text-base md:text-sm",
        lg: "h-10 px-4 py-2 text-base",
        xl: "h-12 px-4 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
