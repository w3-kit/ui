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

  return (
    <div
      className={`
        ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
        rounded-2xl shadow-lg p-4 sm:p-6 w-full mx-auto transition-colors duration-200
        ${className}
      `}
    >
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl font-semibold">Bridge Assets</h2>

        {/* From Network */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-80">From Network</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => setFromNetwork(network)}
                className={`
                  p-3 rounded-xl flex items-center space-x-2
                  ${
                    fromNetwork?.id === network.id
                      ? theme === "dark"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  className="w-6 h-6"
                />
                <span>{network.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Switch Button */}
        <div className="relative h-0">
          <button
            onClick={switchNetworks}
            className={`
              absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full
              ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }
              transition-colors duration-200
            `}
          >
            <IoSwapVertical className="w-5 h-5" />
          </button>
        </div>

        {/* To Network */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-80">To Network</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => setToNetwork(network)}
                className={`
                  p-3 rounded-xl flex items-center space-x-2
                  ${
                    toNetwork?.id === network.id
                      ? theme === "dark"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }
                `}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  className="w-6 h-6"
                />
                <span>{network.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium opacity-80">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`
              w-full bg-transparent outline-none text-lg font-medium p-4 rounded-xl
              ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
            `}
            placeholder="0.0"
          />
        </div>

        {/* Estimated Info */}
        <div className={`
          p-4 rounded-xl space-y-2 text-sm
          ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
        `}>
          <div className="flex justify-between">
            <span className="opacity-80">Estimated Time</span>
            <span>{estimatedTime} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">Bridge Fee</span>
            <span>{estimatedFee} ETH</span>
          </div>
        </div>

        {/* Bridge Button */}
        <button
          onClick={handleBridge}
          disabled={!fromNetwork || !toNetwork || !amount || loading}
          className={`
            w-full py-4 px-4 rounded-xl font-medium text-white
            transition-all duration-200
            ${
              !fromNetwork || !toNetwork || !amount || loading
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-blue-500 hover:bg-blue-600 active:scale-[0.98]"
            }
          `}
        >
          {loading ? "Processing..." : "Bridge Assets"}
        </button>
      </div>
    </div>
  );
} 