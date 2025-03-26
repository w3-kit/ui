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
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const networkStatus: 'connected' | 'connecting' | 'error' = 'connected';
  const gasPrice = '';
  const latency = 0;

  const currentNetworks = showTestnets ? testNetworks : networks;
  
  // Filter networks based on search
  const filteredNetworks = currentNetworks.filter(network => 
    network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    network.chainId.toString().includes(searchQuery)
  );

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      setIsLoading(true);
      setSelectedChainId(chainId);
      await onSwitch(chainId);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedNetwork = [...networks, ...testNetworks].find(n => n.chainId === selectedChainId);

  // Add status indicator component
  const StatusIndicator = () => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        networkStatus === 'connected' ? 'bg-green-500' :
        networkStatus === 'connecting' ? 'bg-yellow-500' :
        'bg-red-500'
      }`} />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {networkStatus === 'connected' ? 'Connected' :
         networkStatus === 'connecting' ? 'Connecting...' :
         'Error'}
      </span>
    </div>
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 
      dark:border-gray-700 shadow-sm w-full max-w-3xl mx-auto transition-all 
      duration-300 ease-in-out transform hover:shadow-lg ${className}`}
    >
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Network
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select a blockchain network to connect to
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search networks..."
                className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 
                  rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
                    hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => setShowTestnets(!showTestnets)}
              className="text-xs sm:text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-700 
                rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 
                transition-all duration-200 whitespace-nowrap flex items-center gap-2
                transform active:scale-95"
            >
              {showTestnets ? 'Show Mainnets' : 'Show Testnets'}
            </button>
          </div>
        </div>
      </div>

      {/* Network Status */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800/50 
        border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusIndicator />
          {gasPrice && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Gas: {gasPrice} Gwei
              </span>
            </div>
          )}
          {latency > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Latency: {latency}ms
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Networks Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredNetworks.map((network) => (
            <button
              key={network.chainId}
              onClick={() => handleNetworkSwitch(network.chainId)}
              disabled={isLoading}
              className={`relative p-4 text-left border rounded-lg transition-all duration-200
                hover:border-blue-500 hover:shadow-sm
                ${selectedChainId === network.chainId
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-3">
                {network.logoURI && (
                  <div className="relative w-8 h-8">
                    <Image
                      src={network.logoURI}
                      alt={network.name}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {network.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Chain ID: {network.chainId}
                  </div>
                </div>
                {selectedChainId === network.chainId && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredNetworks.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 
            animate-fade-in">
            No networks found matching your search
          </div>
        )}

        {/* Network Details */}
        {selectedNetwork && (
          <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg 
            divide-y divide-gray-200 dark:divide-gray-700 text-sm">
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
              <a
                href={selectedNetwork.blockExplorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
              >
                View Explorer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Connection</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-900 dark:text-white">RPC</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-900 dark:text-white">WebSocket</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};