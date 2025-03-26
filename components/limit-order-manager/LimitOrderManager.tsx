import React, { useState } from "react";
import { TrendingDown, TrendingUp, Check, Trash2 } from "lucide-react";
import Image from "next/image";

export interface OrderData {
  id: string;
  type: "limit" | "stop-loss";
  token: {
    symbol: string;
    logoURI: string;
    price: number;
  };
  amount: string;
  price: string;
  status: "active" | "executed" | "cancelled";
  timestamp: number;
  expiry?: number;
}

interface LimitOrderManagerProps {
  orders: OrderData[];
  onOrderCreate?: (order: Omit<OrderData, "id" | "timestamp">) => void;
  onOrderCancel?: (orderId: string) => void;
  className?: string;
}

export const LimitOrderManager: React.FC<LimitOrderManagerProps> = ({
  orders: initialOrders,
  onOrderCreate,
  onOrderCancel,
  className = "",
}) => {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderType, setOrderType] = useState<"limit" | "stop-loss">("limit");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [expiry, setExpiry] = useState("");
  const [errors, setErrors] = useState<{
    amount?: string;
    price?: string;
    expiry?: string;
  }>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    
    if (expiry && (parseInt(expiry) <= 0 || parseInt(expiry) > 30)) {
      newErrors.expiry = "Expiry must be between 1 and 30 days";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrder = async () => {
    if (!validateForm()) return;
    
    setIsCreating(true);
    try {
      const newOrder: OrderData = {
        id: Date.now().toString(),
        type: orderType,
        token: {
          symbol: "ETH",
          logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
          price: 2845.67,
        },
        amount,
        price,
        status: "active",
        timestamp: Date.now(),
        expiry: expiry ? Date.now() + parseInt(expiry) * 24 * 60 * 60 * 1000 : undefined,
      };

      setOrders(prev => [...prev, newOrder]);
      await onOrderCreate?.({
        type: orderType,
        token: newOrder.token,
        amount,
        price,
        status: "active",
        expiry: newOrder.expiry,
      });

      // Show loading for 1 second before success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form and close modal
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
      setOrders(prev => prev.map(order => 
        order.id === orderToCancel 
          ? { ...order, status: "cancelled" }
          : order
      ));
      onOrderCancel?.(orderToCancel);
      setShowCancelModal(false);
      setOrderToCancel(null);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const getStatusColor = (status: OrderData["status"]) => {
    switch (status) {
      case "active":
        return "text-green-500 dark:text-green-400";
      case "executed":
        return "text-blue-500 dark:text-blue-400";
      case "cancelled":
        return "text-red-500 dark:text-red-400";
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Limit Orders</h2>
        <button
          onClick={() => setShowCreateOrder(!showCreateOrder)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setOrderType("limit")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                orderType === "limit"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Limit Order
            </button>
            <button
              onClick={() => setOrderType("stop-loss")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                orderType === "stop-loss"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Stop Loss
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 ${
                  errors.amount ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="0.0"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 ${
                  errors.price ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="0.0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry (days)
              </label>
              <input
                type="number"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 ${
                  errors.expiry ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Optional"
              />
              {errors.expiry && (
                <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
              )}
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={isCreating || showSuccess}
              className={`w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center relative ${
                (isCreating || showSuccess) ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isCreating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  <Check className="w-5 h-5 mr-2 animate-scale-in" />
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
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg group"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={order.token.logoURI}
                  alt={order.token.symbol}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                {order.type === "stop-loss" ? (
                  <TrendingDown className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />
                ) : (
                  <TrendingUp className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {order.amount} {order.token.symbol}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {order.type === "limit" ? "Limit" : "Stop Loss"} @ ${order.price}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className={`font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              {order.status === "active" ? (
                <button
                  onClick={() => handleCancelClick(order.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Cancellation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
