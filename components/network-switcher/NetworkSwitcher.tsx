import React, { useState, useCallback } from 'react';
import { NetworkSwitcherProps, Network, NETWORKS } from './types';
import { switchNetwork } from './utils';

export const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
  currentNetwork,
  onNetworkChange,
  className = '',
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNetworkSwitch = useCallback(async (network: Network) => {
    setIsLoading(true);
    setError(null);

    try {
      await switchNetwork(network);
      onNetworkChange?.(network);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch network');
    } finally {
      setIsLoading(false);
    }
  }, [onNetworkChange]);

  if (variant === 'minimal') {
    return (
      <div className="relative">
        <select
          className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${className}`}
          value={currentNetwork?.chainId}
          onChange={(e) => {
            const network = NETWORKS.find(n => n.chainId === Number(e.target.value));
            if (network) handleNetworkSwitch(network);
          }}
        >
          {NETWORKS.map((network) => (
            <option key={network.chainId} value={network.chainId}>
              {network.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`${className}`}>
        <button
          type="button"
          className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
        >
          {currentNetwork?.logoURI && (
            <img
              src={currentNetwork.logoURI}
              alt={currentNetwork.name}
              className="w-5 h-5 mr-2 rounded-full"
            />
          )}
          <span>{currentNetwork?.name || 'Select Network'}</span>
          <svg
            className={`ml-2 h-5 w-5 transform ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
          {NETWORKS.map((network) => (
            <div
              key={network.chainId}
              className={`group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${
                currentNetwork?.chainId === network.chainId ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleNetworkSwitch(network)}
            >
              {network.logoURI && (
                <img
                  src={network.logoURI}
                  alt={network.name}
                  className="w-6 h-6 mr-3 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{network.name}</p>
                <p className="text-xs text-gray-500">{network.symbol}</p>
              </div>
              {currentNetwork?.chainId === network.chainId && (
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}; 