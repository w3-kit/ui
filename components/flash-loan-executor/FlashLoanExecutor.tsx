import React, { useState } from "react";
import { ArrowUpDown, Loader2, Check, AlertCircle } from "lucide-react";
import Image from "next/image";

export interface FlashLoanData {
  id: string;
  protocol: {
    name: string;
    logoURI: string;
    address: string;
  };
  token: {
    symbol: string;
    logoURI: string;
    decimals: number;
    address: string;
  };
  amount: string;
  profit: string;
  risk: "low" | "medium" | "high";
  status: "pending" | "executing" | "completed" | "failed";
  timestamp: number;
}

interface FlashLoanExecutorProps {
  protocols: {
    name: string;
    logoURI: string;
    address: string;
  }[];
  tokens: {
    symbol: string;
    logoURI: string;
    decimals: number;
    address: string;
  }[];
  onExecute?: (data: Omit<FlashLoanData, "id" | "timestamp">) => void;
  className?: string;
}

export const FlashLoanExecutor: React.FC<FlashLoanExecutorProps> = ({
  protocols,
  tokens,
  onExecute,
  className = "",
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState(protocols[0]);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    amount?: string;
    protocol?: string;
    token?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    if (!selectedProtocol) {
      newErrors.protocol = "Please select a protocol";
    }
    
    if (!selectedToken) {
      newErrors.token = "Please select a token";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExecute = async () => {
    if (!validateForm()) return;
    
    setIsExecuting(true);
    try {
      // Simulate flash loan execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const flashLoanData: Omit<FlashLoanData, "id" | "timestamp"> = {
        protocol: selectedProtocol,
        token: selectedToken,
        amount,
        profit: "0.05", // Example profit in ETH
        risk: "medium",
        status: "completed",
      };

      await onExecute?.(flashLoanData);
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAmount("");
      }, 1500);
    } finally {
      setIsExecuting(false);
    }
  };

  const getRiskColor = (risk: FlashLoanData["risk"]) => {
    switch (risk) {
      case "low":
        return "text-green-500 dark:text-green-400";
      case "medium":
        return "text-yellow-500 dark:text-yellow-400";
      case "high":
        return "text-red-500 dark:text-red-400";
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Protocol
          </label>
          <div className="flex flex-wrap gap-2">
            {protocols.map((protocol) => (
              <button
                key={protocol.address}
                onClick={() => setSelectedProtocol(protocol)}
                className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors flex-1 min-w-[120px] ${
                  selectedProtocol.address === protocol.address
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500"
                }`}
              >
                <Image
                  src={protocol.logoURI}
                  alt={protocol.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {protocol.name}
                </span>
              </button>
            ))}
          </div>
          {errors.protocol && (
            <p className="mt-1 text-sm text-red-500">{errors.protocol}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Token
          </label>
          <div className="flex flex-wrap gap-2">
            {tokens.map((token) => (
              <button
                key={token.address}
                onClick={() => setSelectedToken(token)}
                className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors flex-1 min-w-[120px] ${
                  selectedToken.address === token.address
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-500"
                }`}
              >
                <Image
                  src={token.logoURI}
                  alt={token.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {token.symbol}
                </span>
              </button>
            ))}
          </div>
          {errors.token && (
            <p className="mt-1 text-sm text-red-500">{errors.token}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 ${
                errors.amount ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="0.0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Image
                src={selectedToken.logoURI}
                alt={selectedToken.symbol}
                width={20}
                height={20}
                className="rounded-full"
              />
            </div>
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Profit</span>
            <span className="text-sm font-medium text-green-500">+0.05 ETH</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
            <span className={`text-sm font-medium ${getRiskColor("medium")}`}>Medium</span>
          </div>
        </div>

        <button
          onClick={handleExecute}
          disabled={isExecuting || showSuccess}
          className={`w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center ${
            (isExecuting || showSuccess) ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="whitespace-nowrap">Executing Flash Loan...</span>
            </>
          ) : showSuccess ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              <span className="whitespace-nowrap">Flash Loan Executed!</span>
            </>
          ) : (
            <>
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <span className="whitespace-nowrap">Execute Flash Loan</span>
            </>
          )}
        </button>

        <div className="flex flex-wrap items-center text-sm text-yellow-600 dark:text-yellow-400 gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Make sure you have enough collateral to cover the flash loan fee</span>
        </div>
      </div>
    </div>
  );
}; 