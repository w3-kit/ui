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
    <div className={`bg-white rounded-lg border shadow-sm w-full max-w-3xl mx-auto ${className} `}>
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Network</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select a blockchain network to connect to
            </p>
          </div>
          <button
            onClick={() => setShowTestnets(!showTestnets)}
            className="text-xs sm:text-sm px-3 py-1.5 border rounded-full
              hover:bg-gray-50 transition-colors whitespace-nowrap
              active:bg-gray-100"
          >
            {showTestnets ? 'Show Mainnets' : 'Show Testnets'}
          </button>
        </div>
      </div>

      {/* Networks Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {networks.map((network) => (
            <button
              key={network.chainId}
              onClick={() => onNetworkChange(network)}
              className={`relative p-2 sm:p-4 text-left border rounded-lg transition-all
                hover:shadow-md
                ${currentNetwork?.chainId === network.chainId
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Mobile View (Logo + Chain ID) */}
              <div className="flex flex-col items-center sm:hidden">
                {network.icon && (
                  <img
                    src={network.icon}
                    alt={network.name}
                    className="w-8 h-8 rounded-full mb-1"
                  />
                )}
                <div className="text-xs text-gray-500">
                  {network.chainId}
                </div>
                {currentNetwork?.chainId === network.chainId && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                )}
              </div>

              {/* Desktop View (Full Info) */}
              <div className="hidden sm:flex items-center space-x-3">
                {network.icon && (
                  <img
                    src={network.icon}
                    alt={network.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{network.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Chain ID: {network.chainId}
                  </div>
                </div>
                {currentNetwork?.chainId === network.chainId && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Network Details */}
        {currentNetwork && (
          <div className="mt-6 border rounded-lg divide-y text-sm">
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-gray-600">RPC URL</span>
              <code className="text-xs sm:text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded break-all">
                {currentNetwork.rpcUrl}
              </code>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-gray-600">Currency</span>
              <span className="font-medium">{currentNetwork.currency}</span>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-gray-600">Explorer</span>
              <a
                href={currentNetwork.blockExplorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                View Explorer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};