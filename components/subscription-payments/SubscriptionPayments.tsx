"use client";

import React from "react";
import { Check, Sparkles, Zap, Shield } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { TokenIcon } from "../ui/token-icon";
import { SubscriptionPlan, SubscriptionPaymentsProps } from "./types";

export type { SubscriptionPlan, SubscriptionPaymentsProps };

const icons = { sparkles: Sparkles, zap: Zap, shield: Shield };

export const SubscriptionPayments: React.FC<SubscriptionPaymentsProps> = ({ plans, onSubscribe, className }) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {plans.map((plan) => {
        const Icon = icons[plan.icon];
        return (
          <div
            key={plan.id}
            className={cn(
              "rounded-xl border bg-white dark:bg-gray-950 p-5 flex flex-col",
              plan.isPopular
                ? "border-gray-900 dark:border-white"
                : "border-gray-200 dark:border-gray-800"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
              </div>
              {plan.isPopular && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                  Popular
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{plan.price}</span>
              <div className="flex items-center gap-1">
                <TokenIcon symbol={plan.token.symbol} logoURI={plan.token.logoURI} size="sm" />
                <span className="text-xs text-gray-500 dark:text-gray-400">/{plan.interval}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{plan.description}</p>

            {/* Features */}
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onSubscribe?.(plan.id)}
              variant={plan.isPopular ? "default" : "outline"}
              className="w-full"
            >
              Subscribe
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionPayments;
