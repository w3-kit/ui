"use client";

import React from "react";
import { CreditCard, Check, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubscriptionPaymentsProps } from "./types";
import { formatInterval } from "./utils";

export function SubscriptionPayments({
  plans,
  onSubscribe,
  subscribingId,
  subscribedId,
  emptyMessage = "No plans available",
  className,
}: SubscriptionPaymentsProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Plans</h3>
      </div>

      {/* Plan cards */}
      <div className="space-y-2 px-4 pb-4">
        {plans.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </p>
        )}
        {plans.map((plan) => {
          const isSubscribing = subscribingId === plan.id;
          const isSubscribed = subscribedId === plan.id;

          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-xl px-3 py-3 transition-colors",
                isSubscribed
                  ? "border border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950/20"
                  : plan.popular
                    ? "border border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-900",
              )}
            >
              {/* Plan header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{plan.name}</p>
                  {plan.popular && (
                    <span className="flex items-center gap-0.5 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400">
                      <Star className="h-3 w-3" />
                      Popular
                    </span>
                  )}
                  {isSubscribed && (
                    <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-400">
                      <Check className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-semibold tabular-nums text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {plan.token}
                    {formatInterval(plan.interval)}
                  </span>
                </div>
              </div>

              {plan.description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{plan.description}</p>
              )}

              {/* Features */}
              {plan.features.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {/* Subscribe button */}
              <button
                onClick={() => onSubscribe?.(plan.id)}
                disabled={isSubscribing || isSubscribed}
                className={cn(
                  "mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isSubscribed
                    ? "bg-green-600 text-white dark:bg-green-500"
                    : plan.popular
                      ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
                  (isSubscribing || isSubscribed) && "cursor-not-allowed",
                  isSubscribing && "opacity-60",
                )}
              >
                {isSubscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    Subscribed
                  </>
                ) : isSubscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {plans.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2.5 text-center dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {plans.length} plan{plans.length !== 1 ? "s" : ""} available
          </p>
        </div>
      )}
    </div>
  );
}
