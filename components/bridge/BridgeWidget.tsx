import React, { useState } from "react";
import { ArrowUpDown, Check, Loader2, Info } from "lucide-react";
import Image from "next/image";

export interface Network {
  id: number;
  name: string;
  icon: string;
}

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  decimals: number;
}

interface BridgeProps {
  className?: string;
}

const SUPPORTED_NETWORKS: Network[] = [
  {
    id: 1,
    name: "Ethereum",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040",
  },
  {
    id: 137,
    name: "Polygon",
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=040",
  },
  {
    id: 56,
    name: "BSC",
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040",
  },
  {
    id: 43114,
    name: "Avalanche",
    icon: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=040",
  },
];

const AVAILABLE_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040',
    balance: '1.234',
    decimals: 18
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040',
    balance: '1234.56',
    decimals: 6
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
    balance: '5678.90',
    decimals: 6
  }
];

const TOKEN_FEES = {
  'ETH': '0.001',
  'USDC': '5',
  'USDT': '5'
} as const;

export function BridgeWidget({ className = "" }: BridgeProps) {
  const [fromNetwork, setFromNetwork] = useState<Network | null>(null);
  const [toNetwork, setToNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState<string>("");
  const estimatedTime = "15-30";
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

  const handleBridgeClick = () => {
    if (!fromNetwork || !toNetwork || !amount || isProcessing) return;
    
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsConfirming(false);
    setIsProcessing(true);

    // Simulate bridge processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Reset after showing success
      setTimeout(() => {
        // Reset all states
        setIsComplete(false);
        setAmount("");
        setFromNetwork(null);
        setToNetwork(null);
        setSelectedToken(null);
        setRotationDegrees(0);
        setIsConfirming(false);
      }, 2000);
    }, 2000);
  };

  const isValid = fromNetwork && toNetwork && selectedToken && amount && Number(amount) > 0;

  const getEstimatedFee = () => {
    if (!selectedToken) return '---';
    return `${TOKEN_FEES[selectedToken.symbol as keyof typeof TOKEN_FEES]} ${selectedToken.symbol}`;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-lg 
      p-3 xs:p-4 sm:p-6 max-w-2xl w-full mx-auto ${className}`}
    >
      <div className="space-y-3 xs:space-y-4 sm:space-y-6">
        <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold text-center">
          Bridge Assets
        </h2>

        {/* Networks grid */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            From Network
          </label>
          <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-4 items-center">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => handleFromNetworkSelect(network)}
                disabled={toNetwork?.id === network.id}
                className={`p-1.5 xs:p-2 sm:p-3 rounded-xl flex flex-col sm:flex-row items-center 
                  sm:space-x-2 space-y-1 sm:space-y-0 transition-all duration-300 active:scale-95
                  ${toNetwork?.id === network.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${fromNetwork?.id === network.id
                    ? "bg-blue-500 text-white shadow-lg ring-2 ring-blue-500/50"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
              >
                <Image
                  src={network.icon}
                  alt={network.name}
                  width={32}
                  height={32}
                  className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8"
                />
                <span className="text-xs sm:text-sm font-medium">
                  {network.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Switch Button */}
        <div className="relative h-16">
          <button
            onClick={handleSwitchClick}
            disabled={!fromNetwork || !toNetwork}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out
              ${
                !fromNetwork || !toNetwork
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            style={{
              transform: `translate(-50%, -50%) rotate(${rotationDegrees}deg)`,
            }}
          >
            <ArrowUpDown
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                !fromNetwork || !toNetwork ? "opacity-50" : ""
              }`}
            />
          </button>
        </div>

        {/* To Network - same as From Network */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            To Network
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 items-center">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => handleToNetworkSelect(network)}
                disabled={fromNetwork?.id === network.id}
                className={`p-2 sm:p-3 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-2 space-y-1 sm:space-y-0 
                  transition-all duration-300 active:scale-95
                  ${fromNetwork?.id === network.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${toNetwork?.id === network.id
                    ? "bg-blue-500 text-white shadow-lg ring-2 ring-blue-500/50"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
              >
                <Image
                  src={network.icon}
                  alt={network.name}
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-xs sm:text-sm font-medium">
                  {network.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Token and Amount Input */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            Select Token
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {AVAILABLE_TOKENS.map((token) => (
              <button
                key={token.symbol}
                onClick={() => setSelectedToken(selectedToken?.symbol === token.symbol ? null : token)}
                className={`p-2 sm:p-3 rounded-xl flex flex-col items-center space-y-1
                  transition-all duration-300 active:scale-95
                  ${selectedToken?.symbol === token.symbol
                    ? "bg-blue-500 text-white shadow-lg ring-2 ring-blue-500/50"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
              >
                <Image
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
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>
              <div className="relative">
                <button
                  className="group"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                >
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  
                  {/* Tooltip */}
                  <div className={`absolute bottom-full left-0 mb-2 w-48 xs:w-56 sm:w-64
                    bg-gray-900 dark:bg-gray-700 text-white px-2 py-1.5 rounded-lg text-xs
                    transition-all duration-300 pointer-events-none
                    ${showTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                  >
                    Enter the amount of {selectedToken?.symbol || 'tokens'} you want to bridge. 
                    Make sure you have enough balance including gas fees.
                    <div className="absolute bottom-0 left-4 translate-y-1/2 
                      border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" 
                    />
                  </div>
                </button>
              </div>
            </div>
            {selectedToken && (
              <button
                onClick={() => setAmount(selectedToken.balance)}
                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Max: {selectedToken.balance}
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!selectedToken}
              className="w-full bg-gray-100 dark:bg-gray-700 outline-none 
                text-sm xs:text-base sm:text-lg font-medium 
                p-2.5 xs:p-3 sm:p-4 pr-16 rounded-xl 
                transition-all duration-300 focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="0.0"
            />
            {selectedToken && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2 
                text-gray-500 dark:text-gray-400 text-sm xs:text-base"
              >
                {selectedToken.symbol}
              </div>
            )}
          </div>
        </div>

        {/* Estimated Info */}
        <div className="bg-gray-100 dark:bg-gray-700 
          p-2.5 xs:p-3 sm:p-4 rounded-xl space-y-2 
          text-xs xs:text-sm sm:text-base"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">
              Estimated Time
            </span>
            <span className="font-medium">{estimatedTime} minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Bridge Fee</span>
            <span className="font-medium">{getEstimatedFee()}</span>
          </div>
        </div>

        {/* Bridge Button */}
        <button
          onClick={handleBridgeClick}
          disabled={!isValid || isProcessing}
          className={`w-full py-2.5 xs:py-3 sm:py-4 px-4 rounded-xl font-medium text-white 
            transition-all duration-300 relative overflow-hidden
            ${!isValid 
              ? 'bg-blue-500/50 cursor-not-allowed' 
              : isConfirming
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : isProcessing
                  ? 'bg-blue-500 cursor-wait'
                  : isComplete
                    ? 'bg-green-500'
                    : 'bg-blue-500 hover:bg-blue-600 active:scale-[0.98]'
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
        </button>

        {/* Cancel button when confirming */}
        {isConfirming && (
          <button
            onClick={() => setIsConfirming(false)}
            className="mt-2 w-full py-2 px-4 rounded-xl font-medium text-gray-600 dark:text-gray-400 
              bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
              transition-all duration-300 active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
