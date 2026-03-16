'use client';

import React, { useState } from "react";
import { ArrowUpDown, Loader2, Check, AlertCircle } from "lucide-react";
import {
  Protocol,
  Token,
  FlashLoanData,
  FlashLoanExecutorProps,
  FormErrors,
} from './types';
import { getRiskColor, buttonAnimation, selectionAnimation } from './utils';

export const FlashLoanExecutor: React.FC<FlashLoanExecutorProps> = ({
  protocols,
  tokens,
  onExecute,
  className = "",
  estimatedProfit = "0.05",
  riskLevel = "medium",
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(protocols[0]);
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0]);
  const [amount, setAmount] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
      // Simulate flash loan execution if no handler provided
      if (!onExecute) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const flashLoanData: Omit<FlashLoanData, "id" | "timestamp"> = {
        protocol: selectedProtocol,
        token: selectedToken,
        amount,
        profit: estimatedProfit,
        risk: riskLevel,
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

  return (
    <div className={`bg-card rounded-lg shadow-lg p-4 ${className}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Protocol
          </label>
          <div className="flex flex-wrap gap-2">
            {protocols.map((protocol) => (
              <button
                key={protocol.address}
                onClick={() => setSelectedProtocol(protocol)}
                className={`flex items-center space-x-2 p-2 rounded-lg border ${selectionAnimation} flex-1 min-w-[120px] ${
                  selectedProtocol?.address === protocol.address
                    ? "border-primary bg-info-muted"
                    : "border-border hover:border-primary"
                }`}
              >
                <img
                  src={protocol.logoURI}
                  alt={protocol.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-foreground">
                  {protocol.name}
                </span>
              </button>
            ))}
          </div>
          {errors.protocol && (
            <p className="mt-1 text-sm text-destructive">{errors.protocol}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Token
          </label>
          <div className="flex flex-wrap gap-2">
            {tokens.map((token) => (
              <button
                key={token.address}
                onClick={() => setSelectedToken(token)}
                className={`flex items-center space-x-2 p-2 rounded-lg border ${selectionAnimation} flex-1 min-w-[120px] ${
                  selectedToken?.address === token.address
                    ? "border-primary bg-info-muted"
                    : "border-border hover:border-primary"
                }`}
              >
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-foreground">
                  {token.symbol}
                </span>
              </button>
            ))}
          </div>
          {errors.token && (
            <p className="mt-1 text-sm text-destructive">{errors.token}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-card transition-colors duration-200 ${
                errors.amount ? "border-destructive" : "border-border"
              }`}
              placeholder="0.0"
            />
            {selectedToken && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
            )}
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-destructive">{errors.amount}</p>
          )}
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-sm text-muted-foreground">Estimated Profit</span>
            <span className="text-sm font-medium text-success">+{estimatedProfit} ETH</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Risk Level</span>
            <span className={`text-sm font-medium ${getRiskColor(riskLevel)}`}>
              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
            </span>
          </div>
        </div>

        <button
          onClick={handleExecute}
          disabled={isExecuting || showSuccess}
          className={`w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover ${buttonAnimation} flex items-center justify-center ${
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

        <div className="flex flex-wrap items-center text-sm text-warning gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Make sure you have enough collateral to cover the flash loan fee</span>
        </div>
      </div>
    </div>
  );
};
