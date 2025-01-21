import React, { useState } from 'react';
import { Network, NetworkSwitcherProps } from './types';
import { NETWORKS, TEST_NETWORKS } from './networks';

export const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
  currentNetwork,
  onNetworkChange = () => {},
  className = ''
}) => {
  const [showTestnets, setShowTestnets] = useState(false);
  const networks = showTestnets ? TEST_NETWORKS : NETWORKS;

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Network</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a blockchain network to connect to
            </p>
          </div>
          <button
            onClick={() => setShowTestnets(!showTestnets)}
            className="text-sm px-3 py-1 border rounded-full
              hover:bg-gray-50 transition-colors"
          >
            {showTestnets ? 'Show Mainnets' : 'Show Testnets'}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {networks.map((network) => (
            <button
              key={network.chainId}
              onClick={() => onNetworkChange(network)}
              className={`relative p-4 text-left border rounded-lg transition-all
                ${currentNetwork?.chainId === network.chainId
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center space-x-3">
                {network.icon && (
                  <img
                    src={network.icon}
                    alt={network.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">{network.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Chain ID: {network.chainId}
                  </div>
                </div>
              </div>

              {currentNetwork?.chainId === network.chainId && (
                <div className="absolute top-3 right-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>

        {currentNetwork && (
          <div className="mt-6 border rounded-lg divide-y">
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">RPC URL</span>
              <code className="text-sm text-gray-900 font-mono">
                {currentNetwork.rpcUrl}
              </code>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">Currency</span>
              <span className="font-medium">{currentNetwork.currency}</span>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">Explorer</span>
              <a
                href={currentNetwork.blockExplorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black hover:underline"
              >
                View Explorer ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};