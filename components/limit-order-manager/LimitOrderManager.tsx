"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { TokenIcon } from "../ui/token-icon";
import { Badge } from "../ui/badge";
import { OrderData, LimitOrderManagerProps } from "./types";
import { getStatusVariant, formatTimestamp } from "./utils";

export type { OrderData, LimitOrderManagerProps };

export const LimitOrderManager: React.FC<LimitOrderManagerProps> = ({
  orders,
  onOrderCancel,
  className,
}) => {
  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Limit Orders</h3>
      </div>

      {orders.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-400">No orders</div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between px-4 py-3 group">
              <div className="flex items-center gap-3">
                <TokenIcon symbol={order.token.symbol} logoURI={order.token.logoURI} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.amount} {order.token.symbol}
                    </p>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                      {order.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    @ ${order.price} · {formatTimestamp(order.timestamp)}
                  </p>
                </div>
              </div>
              {order.status === "active" && onOrderCancel && (
                <button
                  onClick={() => onOrderCancel(order.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-150"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LimitOrderManager;
