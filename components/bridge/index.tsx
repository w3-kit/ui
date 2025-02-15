import React, { useState } from "react";
import { useTheme } from "next-themes";
import { IoSwapVertical } from "react-icons/io5";
import { TokenSymbol } from "../token-list/tokenConfigs";

export interface Network {
  id: number;
  name: string;
  icon: string;
}

interface BridgeProps {
  onBridge: (params: {
    fromNetwork: Network;
    toNetwork: Network;
    token: TokenSymbol;
    amount: string;
  }) => Promise<void>;
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

export function BridgeWidget({ onBridge, className = "" }: BridgeProps) {
  const { theme } = useTheme();
  const [fromNetwork, setFromNetwork] = useState<Network | null>(null);
  const [toNetwork, setToNetwork] = useState<Network | null>(null);
  const [token, setToken] = useState<TokenSymbol | "">("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState("15-30");
  const [estimatedFee, setEstimatedFee] = useState("0.001");
  const [rotationDegrees, setRotationDegrees] = useState(0);

  const handleBridge = async () => {
    if (!fromNetwork || !toNetwork || !token || !amount) return;

    try {
      setLoading(true);
      await onBridge({ fromNetwork, toNetwork, token, amount });
    } catch (error) {
      console.error("Bridge failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchNetworks = () => {
    setFromNetwork(toNetwork);
    setToNetwork(fromNetwork);
  };

  const handleSwitchClick = () => {
    setRotationDegrees(prev => prev + 180);
    switchNetworks();
  };

  return (
    <div
      className={`
        ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
        rounded-2xl shadow-lg p-4 sm:p-6 max-w-2xl w-full mx-auto
        ${className}
      `}
    >
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">Bridge Assets</h2>

        {/* From Network */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium opacity-80">From Network</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => setFromNetwork(network)}
                className={`
                  p-2 sm:p-3 rounded-xl flex flex-col sm:flex-row items-center 
                  sm:space-x-2 space-y-1 sm:space-y-0
                  transition-transform duration-200
                  active:scale-95
                  ${
                    fromNetwork?.id === network.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : theme === "dark"
                      ? "bg-gray-700 active:bg-gray-600"
                      : "bg-gray-100 active:bg-gray-200"
                  }
                `}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-xs sm:text-sm font-medium">{network.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Switch Button with centered positioning */}
        <div className="relative h-16">
          <button
            onClick={handleSwitchClick}
            disabled={!fromNetwork || !toNetwork}
            className={`
              absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-sm
              transition-all duration-300 ease-in-out
              ${theme === "dark" ? "bg-gray-700" : "bg-white"}
              ${(!fromNetwork || !toNetwork) 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              }
            `}
            style={{ transform: `translate(-50%, -50%) rotate(${rotationDegrees}deg)` }}
          >
            <IoSwapVertical 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${(!fromNetwork || !toNetwork) ? "opacity-50" : ""}`} 
            />
          </button>
        </div>

        {/* To Network */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium opacity-80">To Network</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => setToNetwork(network)}
                className={`
                  p-2 sm:p-3 rounded-xl flex flex-col sm:flex-row items-center 
                  sm:space-x-2 space-y-1 sm:space-y-0
                  transition-transform duration-200
                  active:scale-95
                  ${
                    toNetwork?.id === network.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : theme === "dark"
                      ? "bg-gray-700 active:bg-gray-600"
                      : "bg-gray-100 active:bg-gray-200"
                  }
                `}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-xs sm:text-sm font-medium">{network.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium opacity-80">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`
              w-full bg-transparent outline-none text-base sm:text-lg font-medium 
              p-3 sm:p-4 rounded-xl transition-all duration-200
              focus:ring-2 focus:ring-blue-500
              ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
            `}
            placeholder="0.0"
          />
        </div>

        {/* Estimated Info */}
        <div className={`
          p-3 sm:p-4 rounded-xl space-y-2 text-sm sm:text-base
          transition-all duration-200
          ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
        `}>
          <div className="flex justify-between items-center">
            <span className="opacity-80">Estimated Time</span>
            <span className="font-medium">{estimatedTime} minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-80">Bridge Fee</span>
            <span className="font-medium">{estimatedFee} ETH</span>
          </div>
        </div>

        {/* Bridge Button */}
        <button
          onClick={handleBridge}
          disabled={!fromNetwork || !toNetwork || !amount || loading}
          className={`
            w-full py-3 sm:py-4 px-4 rounded-xl font-medium text-white
            transition-transform duration-200
            ${
              !fromNetwork || !toNetwork || !amount || loading
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-500 hover:bg-blue-600 active:scale-95"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Processing...</span>
            </span>
          ) : (
            "Bridge Assets"
          )}
        </button>
      </div>
    </div>
  );
} 