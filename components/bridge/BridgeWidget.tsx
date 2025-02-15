import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";

export interface Network {
  id: number;
  name: string;
  icon: string;
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

export function BridgeWidget({ className = "" }: BridgeProps) {
  const [fromNetwork, setFromNetwork] = useState<Network | null>(null);
  const [toNetwork, setToNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState("15-30");
  const [estimatedFee, setEstimatedFee] = useState("0.001");
  const [rotationDegrees, setRotationDegrees] = useState(0);

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
    setFromNetwork(network);
  };

  const handleToNetworkSelect = (network: Network) => {
    if (fromNetwork?.id === network.id) return;
    setToNetwork(network);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-2xl w-full mx-auto ${className}`}
    >
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Bridge Assets
        </h2>

        {/* Networks grid */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            From Network
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 items-center">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => handleFromNetworkSelect(network)}
                disabled={toNetwork?.id === network.id}
                className={`p-2 sm:p-3 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-2 space-y-1 sm:space-y-0 transition-transform duration-200 active:scale-95
                  ${toNetwork?.id === network.id ? 'opacity-50 cursor-not-allowed' : ''}
                  ${fromNetwork?.id === network.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  className="w-6 h-6 sm:w-8 sm:h-8"
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
                className={`p-2 sm:p-3 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-2 space-y-1 sm:space-y-0 transition-transform duration-200 active:scale-95
                  ${fromNetwork?.id === network.id ? 'opacity-50 cursor-not-allowed' : ''}
                  ${toNetwork?.id === network.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
              >
                <img
                  src={network.icon}
                  alt={network.name}
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-xs sm:text-sm font-medium">
                  {network.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 outline-none text-base sm:text-lg font-medium p-3 sm:p-4 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            placeholder="0.0"
          />
        </div>

        {/* Estimated Info */}
        <div className="bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-xl space-y-2 text-sm sm:text-base">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">
              Estimated Time
            </span>
            <span className="font-medium">{estimatedTime} minutes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Bridge Fee</span>
            <span className="font-medium">{estimatedFee} ETH</span>
          </div>
        </div>

        {/* Bridge Button */}
        <button
          disabled
          className="w-full py-3 sm:py-4 px-4 rounded-xl font-medium text-white bg-blue-500 opacity-50 cursor-not-allowed"
        >
          Preview Only
        </button>
      </div>
    </div>
  );
}
