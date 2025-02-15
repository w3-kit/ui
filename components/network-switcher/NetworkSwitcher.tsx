import React, { useState } from 'react';
import { NetworkSwitcherProps } from './types';
import Image from 'next/image';

export const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
  networks,
  testNetworks,
  onSwitch,
  className = ''
}) => {
  const [showTestnets, setShowTestnets] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const currentNetworks = showTestnets ? testNetworks : networks;

  const handleNetworkSwitch = (chainId: number) => {
    setSelectedChainId(chainId);
    onSwitch(chainId);
  };

  const selectedNetwork = networks.find(n => n.chainId === selectedChainId);

  return (
<<<<<<< HEAD
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-full max-w-3xl mx-auto ${className}`}>
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Network</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
=======
    <div className={`bg-white rounded-lg border shadow-sm w-full max-w-3xl mx-auto ${className} `}>
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Network</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
>>>>>>> d09deb13e8a3559d0957c1a80d10627c5254db5e
              Select a blockchain network to connect to
            </p>
          </div>
          <button
            onClick={() => setShowTestnets(!showTestnets)}
<<<<<<< HEAD
            className="text-xs sm:text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-full
              text-gray-700 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap
              active:bg-gray-100 dark:active:bg-gray-600"
=======
            className="text-xs sm:text-sm px-3 py-1.5 border rounded-full
              hover:bg-gray-50 transition-colors whitespace-nowrap
              active:bg-gray-100"
>>>>>>> d09deb13e8a3559d0957c1a80d10627c5254db5e
          >
            {showTestnets ? 'Show Mainnets' : 'Show Testnets'}
          </button>
        </div>
      </div>

      {/* Networks Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3">
<<<<<<< HEAD
          {currentNetworks.map((network) => (
            <button
              key={network.chainId}
              onClick={() => handleNetworkSwitch(network.chainId)}
              className={`relative p-2 sm:p-4 text-left border rounded-lg transition-all
                hover:shadow-md
                ${selectedChainId === network.chainId
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              {/* Mobile View (Logo + Chain ID) */}
              <div className="flex flex-col items-center sm:hidden">
                {network.logoURI && (
                  <Image
                    src={network.logoURI}
=======
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
>>>>>>> d09deb13e8a3559d0957c1a80d10627c5254db5e
                    alt={network.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                )}
<<<<<<< HEAD
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {network.chainId}
                </div>
                {selectedChainId === network.chainId && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                )}
              </div>

              {/* Desktop View (Full Info) */}
              <div className="hidden sm:flex items-center space-x-3">
                {network.logoURI && (
                  <Image
                    src={network.logoURI}
                    alt={network.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white truncate">{network.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Chain ID: {network.chainId}
                  </div>
                </div>
                {selectedChainId === network.chainId && (
=======
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{network.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Chain ID: {network.chainId}
                  </div>
                </div>
                {currentNetwork?.chainId === network.chainId && (
>>>>>>> d09deb13e8a3559d0957c1a80d10627c5254db5e
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Network Details */}
<<<<<<< HEAD
        {selectedNetwork && (
          <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">RPC URL</span>
              <code className="text-xs sm:text-sm text-gray-900 dark:text-white font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded break-all">
                {selectedNetwork.rpcUrl}
              </code>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Currency</span>
              <span className="font-medium text-gray-900 dark:text-white">{selectedNetwork.currency}</span>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Explorer</span>
=======
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
>>>>>>> d09deb13e8a3559d0957c1a80d10627c5254db5e
              <a
                href={selectedNetwork.blockExplorer}
                target="_blank"
                rel="noopener noreferrer"
<<<<<<< HEAD
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
=======
                className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
>>>>>>> d09deb13e8a3559d0957c1a80d10627c5254db5e
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