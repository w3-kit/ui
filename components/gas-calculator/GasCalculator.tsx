import React, { useState, useEffect } from 'react';
import { GasCalculatorProps, GasPrice, GasEstimate } from './types';
import { fetchGasPrice, estimateTransactionCost, formatGwei, formatEther } from './utils';

export const GasCalculator: React.FC<GasCalculatorProps> = ({
  className = '',
  onGasSelect,
  refreshInterval = 15000,
  chainId = 1
}) => {
  const [gasPrice, setGasPrice] = useState<GasPrice | null>(null);
  const [gasLimit, setGasLimit] = useState<number>(21000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<'low' | 'medium' | 'high'>('medium');

  const updateGasPrice = async () => {
    try {
      const price = await fetchGasPrice(chainId);
      setGasPrice(price);
      setError(null);
    } catch (err) {
      setError('Failed to fetch gas prices');
      console.error('Gas price fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateGasPrice();
    const interval = setInterval(updateGasPrice, refreshInterval);
    return () => clearInterval(interval);
  }, [chainId, refreshInterval]);

  const estimate: GasEstimate | null = gasPrice
    ? estimateTransactionCost(gasPrice, gasLimit)
    : null;

  const handleSpeedSelect = (speed: 'low' | 'medium' | 'high') => {
    setSelectedSpeed(speed);
    if (gasPrice) {
      const price = gasPrice[speed];
      onGasSelect?.(gasLimit, price);
    }
  };

  const getSpeedLabel = (speed: 'low' | 'medium' | 'high') => {
    switch (speed) {
      case 'low':
        return { label: 'Economy', time: '5+ mins' };
      case 'medium':
        return { label: 'Standard', time: '< 2 mins' };
      case 'high':
        return { label: 'Fast', time: '< 30 secs' };
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 bg-white rounded-xl p-6 shadow-lg">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6 space-y-6">
        {/* Gas Limit Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="gasLimit" className="text-sm font-medium text-gray-700">
              Gas Limit
            </label>
            <div className="flex space-x-2">
              {[21000, 65000, 100000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setGasLimit(preset)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    gasLimit === preset
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              id="gasLimit"
              value={gasLimit}
              onChange={(e) => setGasLimit(Number(e.target.value))}
              className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">units</span>
            </div>
          </div>
        </div>

        {/* Gas Price Options */}
        {gasPrice && (
          <div className="grid grid-cols-3 gap-4">
            {(['low', 'medium', 'high'] as const).map((speed) => {
              const { label, time } = getSpeedLabel(speed);
              return (
                <button
                  key={speed}
                  onClick={() => handleSpeedSelect(speed)}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    selectedSpeed === speed
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-xs text-gray-500">{time}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatGwei(gasPrice[speed])}
                    </div>
                    <div className="text-sm text-gray-500">
                      Gwei
                    </div>
                    {estimate && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        ≈ {estimate.estimatedCost[speed]} ETH
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Network Info */}
        {gasPrice && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Base Fee</span>
              <span className="font-medium text-gray-900">{formatGwei(gasPrice.baseFee)} Gwei</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Last Block</span>
              <span className="font-medium text-gray-900">#{gasPrice.lastBlock}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 