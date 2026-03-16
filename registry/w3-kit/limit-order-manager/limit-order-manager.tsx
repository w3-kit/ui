"use client";

import React, { useState } from "react";
import { TrendingDown, TrendingUp, Check, Trash2 } from "lucide-react";
import { OrderData, LimitOrderManagerProps, FormErrors } from "./types";
import {
  getStatusColor,
  validateOrderForm,
  formatStatus,
  calculateExpiry,
  DEFAULT_TOKEN,
} from "./utils";

export function LimitOrderManager({
  orders: initialOrders,
  onOrderCreate,
  onOrderCancel,
  className = "",
}: LimitOrderManagerProps) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderType, setOrderType] = useState<"limit" | "stop-loss">("limit");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [expiry, setExpiry] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreateOrder = async () => {
    const validationErrors = validateOrderForm(amount, price, expiry);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsCreating(true);
    try {
      const newOrder: OrderData = {
        id: Date.now().toString(),
        type: orderType,
        token: DEFAULT_TOKEN,
        amount,
        price,
        status: "active",
        timestamp: Date.now(),
        expiry: calculateExpiry(expiry),
      };

      setOrders((prev) => [...prev, newOrder]);
      await onOrderCreate?.({
        type: orderType,
        token: newOrder.token,
        amount,
        price,
        status: "active",
        expiry: newOrder.expiry,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAmount("");
        setPrice("");
        setExpiry("");
        setErrors({});
        setShowCreateOrder(false);
      }, 1500);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelClick = (orderId: string) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderToCancel
            ? { ...order, status: "cancelled" as const }
            : order
        )
      );
      onOrderCancel?.(orderToCancel);
      setShowCancelModal(false);
      setOrderToCancel(null);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  return (
    <div
      className={`bg-card rounded-lg shadow-lg p-4 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Limit Orders
        </h2>
        <button
          onClick={() => setShowCreateOrder(!showCreateOrder)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
        >
          Create Order
        </button>
      </div>

      {/* Create Order Form with Transitions */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          showCreateOrder
            ? "opacity-100 max-h-[1000px] mb-6"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setOrderType("limit")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                orderType === "limit"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              Limit Order
            </button>
            <button
              onClick={() => setOrderType("stop-loss")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                orderType === "stop-loss"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              Stop Loss
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground transition-colors duration-200 ${
                  errors.amount
                    ? "border-destructive"
                    : "border-border"
                }`}
                placeholder="0.0"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground transition-colors duration-200 ${
                  errors.price
                    ? "border-destructive"
                    : "border-border"
                }`}
                placeholder="0.0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Expiry (days)
              </label>
              <input
                type="number"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground transition-colors duration-200 ${
                  errors.expiry
                    ? "border-destructive"
                    : "border-border"
                }`}
                placeholder="Optional"
              />
              {errors.expiry && (
                <p className="mt-1 text-sm text-destructive">{errors.expiry}</p>
              )}
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={isCreating || showSuccess}
              className={`w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center relative ${
                isCreating || showSuccess ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isCreating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Order...
                </>
              ) : showSuccess ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Order Created!
                </>
              ) : (
                "Create Order"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 bg-muted rounded-lg group"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={order.token.logoURI}
                  alt={order.token.symbol}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                {order.type === "stop-loss" ? (
                  <TrendingDown className="absolute -top-1 -right-1 w-4 h-4 text-destructive" />
                ) : (
                  <TrendingUp className="absolute -top-1 -right-1 w-4 h-4 text-success" />
                )}
              </div>
              <div>
                <div className="font-medium text-foreground">
                  {order.amount} {order.token.symbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.type === "limit" ? "Limit" : "Stop Loss"} @ $
                  {order.price}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className={`font-medium ${getStatusColor(order.status)}`}>
                  {formatStatus(order.status)}
                </span>
              </div>
              {order.status === "active" ? (
                <button
                  onClick={() => handleCancelClick(order.id)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  title="Delete order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-overlay/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Confirm Cancellation
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive-hover transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LimitOrderManager;
