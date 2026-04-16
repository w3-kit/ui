"use client";

import { useState } from "react";
import { ListOrdered, Plus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LimitOrder, LimitOrderManagerProps } from "./types";

type Tab = "active" | "filled" | "all";

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function filterOrders(orders: LimitOrder[], tab: Tab): LimitOrder[] {
  if (tab === "all") return orders;
  return orders.filter((o) => o.status === tab);
}

export function LimitOrderManager({
  orders,
  onCancel,
  onCreateOrder,
  cancellingId,
  className,
}: LimitOrderManagerProps) {
  const [tab, setTab] = useState<Tab>("active");

  const filtered = filterOrders(orders, tab);
  const activeCount = orders.filter((o) => o.status === "active").length;

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <ListOrdered className="h-[18px] w-[18px] text-gray-900 dark:text-gray-100" />
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
            Limit Orders
          </h2>
          {activeCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {activeCount}
            </span>
          )}
        </div>
        {onCreateOrder && (
          <button
            onClick={onCreateOrder}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Plus className="h-3.5 w-3.5" />
            New Order
          </button>
        )}
      </div>

      {/* Tab filter */}
      <div className="flex gap-1 px-5 pt-3 pb-1">
        {(["active", "filled", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
              tab === t
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Order list */}
      <div className="px-5 py-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            No {tab === "all" ? "" : tab + " "}orders
          </p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {filtered.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {order.tokenIcon ? (
                    <img
                      src={order.tokenIcon}
                      alt={order.token}
                      className="h-8 w-8 shrink-0 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {order.token.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none",
                          order.type === "buy"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        )}
                      >
                        {order.type}
                      </span>
                      <span className="truncate text-sm font-medium text-gray-900 tabular-nums dark:text-gray-100">
                        {order.amount} {order.token}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">
                      @ ${order.price} · {formatTime(order.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                      order.status === "active" &&
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                      order.status === "filled" &&
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                      order.status === "cancelled" &&
                        "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
                    )}
                  >
                    {order.status}
                  </span>

                  {order.status === "active" && onCancel && (
                    <button
                      onClick={() => onCancel(order.id)}
                      disabled={cancellingId === order.id}
                      className="rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-900/20"
                      title="Cancel order"
                    >
                      {cancellingId === order.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
        </span>
      </div>
    </div>
  );
}

export default LimitOrderManager;
