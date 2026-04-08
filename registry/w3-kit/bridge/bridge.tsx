"use client";

import React, { useState } from "react";
import { ArrowUpDown, Check, Loader2, Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Token, BridgeWidgetProps } from './types';
import {
  DEFAULT_NETWORKS,
  DEFAULT_TOKENS,
  DEFAULT_TOKEN_FEES,
  buttonAnimation,
  switchAnimation,
  tooltipAnimation,
} from './utils';

export function BridgeWidget({
  className = "",
  networks = DEFAULT_NETWORKS,
  tokens = DEFAULT_TOKENS,
  tokenFees = DEFAULT_TOKEN_FEES,
  estimatedTime = "15-30",
  onBridge,
}: BridgeWidgetProps) {
  const [fromNetwork, setFromNetwork] = useState<Network | null>(null);
  const [toNetwork, setToNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const switchNetworks = () => {
    setFromNetwork(toNetwork);
    setToNetwork(fromNetwork);
  };

  const handleSwitchClick = () => {
    setRotationDegrees((prev) => prev + 180);
    switchNetworks();
  };

  const handleFromNetworkSelect = (network: Network) => {
    if (toNetwork?.id === network.id) return;
    setFromNetwork(fromNetwork?.id === network.id ? null : network);
  };

  const handleToNetworkSelect = (network: Network) => {
    if (fromNetwork?.id === network.id) return;
    setToNetwork(toNetwork?.id === network.id ? null : network);
  };

  const resetState = () => {
    setIsComplete(false);
    setAmount("");
    setFromNetwork(null);
    setToNetwork(null);
    setSelectedToken(null);
    setRotationDegrees(0);
    setIsConfirming(false);
  };

  const handleBridgeClick = async () => {
    if (!fromNetwork || !toNetwork || !selectedToken || !amount || isProcessing) return;

    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsConfirming(false);
    setIsProcessing(true);

    try {
      if (onBridge) {
        await onBridge({
          fromNetwork,
          toNetwork,
          token: selectedToken,
          amount,
        });
      } else {
        // Simulate bridge processing if no handler provided
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setIsProcessing(false);
      setIsComplete(true);

      // Reset after showing success
      setTimeout(resetState, 2000);
    } catch {
      setIsProcessing(false);
      setIsConfirming(false);
    }
  };

  const isValid = fromNetwork && toNetwork && selectedToken && amount && Number(amount) > 0;

  const getEstimatedFee = () => {
    if (!selectedToken) return '---';
    return `${tokenFees[selectedToken.symbol] || '0'} ${selectedToken.symbol}`;
  };

  return (
    <Card className={`max-w-2xl w-full mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg xs:text-xl sm:text-2xl font-semibold text-center">
          Bridge Assets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 xs:space-y-4 sm:space-y-6">
        {/* Networks grid */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-foreground">
            From Network
          </label>
          <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-4 items-center">
            {networks.map((network) => (
              <Button
                key={network.id}
                onClick={() => handleFromNetworkSelect(network)}
                disabled={toNetwork?.id === network.id}
                variant={fromNetwork?.id === network.id ? "default" : "outline"}
                className={`p-1.5 xs:p-2 sm:p-3 rounded-xl flex flex-col sm:flex-row items-center
                  sm:space-x-2 space-y-1 sm:space-y-0 ${buttonAnimation}
                  ${fromNetwork?.id === network.id ? "shadow-lg ring-2 ring-primary/50" : ""}`}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  width={32}
                  height={32}
                  className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8"
                />
                <span className="text-xs sm:text-sm font-medium">
                  {network.name}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Switch Button */}
        <div className="relative h-16">
          <Button
            onClick={handleSwitchClick}
            disabled={!fromNetwork || !toNetwork}
            variant="outline"
            size="icon"
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm ${switchAnimation}`}
            style={{
              transform: `translate(-50%, -50%) rotate(${rotationDegrees}deg)`,
            }}
          >
            <ArrowUpDown
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                !fromNetwork || !toNetwork ? "opacity-50" : ""
              }`}
            />
          </Button>
        </div>

        {/* To Network */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-foreground">
            To Network
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 items-center">
            {networks.map((network) => (
              <Button
                key={network.id}
                onClick={() => handleToNetworkSelect(network)}
                disabled={fromNetwork?.id === network.id}
                variant={toNetwork?.id === network.id ? "default" : "outline"}
                className={`p-2 sm:p-3 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-2 space-y-1 sm:space-y-0
                  ${buttonAnimation}
                  ${toNetwork?.id === network.id ? "shadow-lg ring-2 ring-primary/50" : ""}`}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-xs sm:text-sm font-medium">
                  {network.name}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Token and Amount Input */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-foreground">
            Select Token
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {tokens.map((token) => (
              <Button
                key={token.symbol}
                onClick={() => setSelectedToken(selectedToken?.symbol === token.symbol ? null : token)}
                variant={selectedToken?.symbol === token.symbol ? "default" : "outline"}
                className={`p-2 sm:p-3 rounded-xl flex flex-col items-center space-y-1
                  ${buttonAnimation}
                  ${selectedToken?.symbol === token.symbol ? "shadow-lg ring-2 ring-primary/50" : ""}`}
              >
                <img
                  src={token.icon}
                  alt={token.symbol}
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium">
                    {token.symbol}
                  </div>
                  <div className="text-xs opacity-75">
                    Balance: {token.balance}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-sm sm:text-base font-medium text-foreground">
                Amount
              </label>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="group h-auto w-auto p-0"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                >
                  <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />

                  {/* Tooltip */}
                  <div className={`absolute bottom-full left-0 mb-2 w-48 xs:w-56 sm:w-64
                    bg-popover text-popover-foreground px-2 py-1.5 rounded-lg text-xs border shadow-md
                    ${tooltipAnimation} pointer-events-none
                    ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  >
                    Enter the amount of {selectedToken?.symbol || 'tokens'} you want to bridge.
                    Make sure you have enough balance including gas fees.
                    <div className="absolute bottom-0 left-4 translate-y-1/2
                      border-4 border-transparent border-t-popover"
                    />
                  </div>
                </Button>
              </div>
            </div>
            {selectedToken && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setAmount(selectedToken.balance)}
                className="text-xs h-auto p-0"
              >
                Max: {selectedToken.balance}
              </Button>
            )}
          </div>

          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!selectedToken}
              className="w-full text-sm xs:text-base sm:text-lg font-medium
                p-2.5 xs:p-3 sm:p-4 pr-16 rounded-xl"
              placeholder="0.0"
            />
            {selectedToken && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2
                text-muted-foreground text-sm xs:text-base"
              >
                {selectedToken.symbol}
              </div>
            )}
          </div>
        </div>

        {/* Estimated Info */}
        <div className="bg-muted p-2.5 xs:p-3 sm:p-4 rounded-xl space-y-2
          text-xs xs:text-sm sm:text-base"
        >
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              Estimated Time
            </span>
            <span className="font-medium">{estimatedTime} minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Bridge Fee</span>
            <span className="font-medium">{getEstimatedFee()}</span>
          </div>
        </div>

        {/* Bridge Button */}
        <Button
          onClick={handleBridgeClick}
          disabled={!isValid || isProcessing}
          className={`w-full py-2.5 xs:py-3 sm:py-4 px-4 rounded-xl font-medium
            transition-all duration-300 relative overflow-hidden
            ${!isValid
              ? 'opacity-50 cursor-not-allowed'
              : isConfirming
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : isProcessing
                  ? 'cursor-wait'
                  : isComplete
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'active:scale-[0.98]'
            }`}
        >
          <div className={`flex items-center justify-center gap-2
            transition-all duration-300
            ${isProcessing ? 'opacity-0' : 'opacity-100'}`}
          >
            {isConfirming ? (
              <>
                Confirm Bridge
                <span className="text-sm opacity-75">
                  ({Number(amount)} {selectedToken?.symbol} from {fromNetwork?.name} to {toNetwork?.name})
                </span>
              </>
            ) : isComplete ? (
              <>
                <Check className="w-5 h-5" />
                Bridge Complete!
              </>
            ) : (
              'Bridge Assets'
            )}
          </div>

          {/* Processing Spinner */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {/* Progress Bar */}
          <div className={`absolute bottom-0 left-0 h-1 bg-white/20
            transition-all duration-300 ease-in-out
            ${isProcessing ? 'w-full' : 'w-0'}`}
          />
        </Button>

        {/* Cancel button when confirming */}
        {isConfirming && (
          <Button
            onClick={() => setIsConfirming(false)}
            variant="outline"
            className="mt-2 w-full"
          >
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
