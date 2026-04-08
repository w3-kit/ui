"use client";

import React, { useCallback } from "react";
import { Check, Sparkles, Zap, Shield, CreditCard, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { TokenIcon } from "../ui/token-icon";
import { SubscriptionPlan, SubscriptionPaymentsProps } from "./types";

export type { SubscriptionPlan, SubscriptionPaymentsProps };

const icons = { sparkles: Sparkles, zap: Zap, shield: Shield };

function PlanCard({
  plan,
  onSubscribe,
  isLoading,
}: {
  plan: SubscriptionPlan;
  onSubscribe?: (planId: string) => void;
  isLoading: boolean;
}) {
  const Icon = icons[plan.icon];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSubscribe?.(plan.id);
      }
    },
    [onSubscribe, plan.id],
  );

  return (
    <div
      className={cn(
        "rounded-xl border bg-white dark:bg-gray-950 p-5 flex flex-col relative",
        plan.isPopular
          ? "border-gray-900 dark:border-white ring-1 ring-gray-900 dark:ring-white"
          : "border-gray-200 dark:border-gray-800",
      )}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 mb-0.5">
        <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {plan.price}
        </span>
        <div className="flex items-center gap-1">
          <TokenIcon symbol={plan.token.symbol} logoURI={plan.token.logoURI} size="sm" />
          <span className="text-xs text-gray-500 dark:text-gray-400">/{plan.interval}</span>
        </div>
      </div>
      {plan.priceUsd && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums mb-3">
          ≈ ${plan.priceUsd} USD
        </p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800 mb-4" />

      {/* Features */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Check
              className={cn(
                "h-3.5 w-3.5 mt-0.5 flex-shrink-0",
                plan.isPopular
                  ? "text-gray-900 dark:text-white"
                  : "text-green-600 dark:text-green-400",
              )}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSubscribe?.(plan.id)}
        onKeyDown={handleKeyDown}
        variant={plan.isPopular ? "default" : "outline"}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          "Subscribe"
        )}
      </Button>
    </div>
  );
}

export const SubscriptionPayments: React.FC<SubscriptionPaymentsProps> = ({
  plans,
  onSubscribe,
  loadingPlanId,
  className,
}) => {
  // Empty state
  if (!plans || plans.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
          className,
        )}
      >
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <CreditCard className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No plans available</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Subscription plans will appear here when configured
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "grid gap-4",
          plans.length === 1 && "grid-cols-1 max-w-sm",
          plans.length === 2 && "grid-cols-1 sm:grid-cols-2",
          plans.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSubscribe={onSubscribe}
            isLoading={loadingPlanId === plan.id}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPayments;
