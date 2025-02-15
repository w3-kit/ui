import React, { useState, useEffect, useCallback } from 'react';
import { GasCalculatorProps, GasPrice, GasEstimate } from './types';
import { fetchGasPrice, estimateTransactionCost, formatGwei } from './utils';

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

  const updateGasPrice = useCallback(async () => {
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
  }, [chainId]);

  useEffect(() => {
    updateGasPrice();
    const interval = setInterval(updateGasPrice, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, updateGasPrice]);

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
        return { label: 'Economy', time: '5+ mins', icon: '🐢' };
      case 'medium':
        return { label: 'Standard', time: '< 2 mins', icon: '🚶' };
      case 'high':
        return { label: 'Fast', time: '< 30 secs', icon: '⚡' };
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gas Calculator</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Estimate transaction costs based on current network conditions
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Gas Limit Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Gas Limit</label>
            <div className="flex space-x-2">
              {[21000, 65000, 100000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setGasLimit(preset)}
                  className={`px-2 py-1 text-xs rounded transition-colors
                    ${gasLimit === preset
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={gasLimit}
              onChange={(e) => setGasLimit(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter gas limit"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">units</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-[120px] bg-gray-100 dark:bg-gray-700 rounded-lg" />
            <div className="h-[80px] bg-gray-100 dark:bg-gray-700 rounded-lg" />
          </div>
        ) : error ? (
          <div className="p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : gasPrice && (
          <>
            {/* Speed Options */}
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((speed) => {
                const { label, time, icon } = getSpeedLabel(speed);
                return (
                  <button
                    key={speed}
                    onClick={() => handleSpeedSelect(speed)}
                    className={`relative p-4 text-left border rounded-lg transition-all
                      ${selectedSpeed === speed
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl" role="img" aria-label={label}>
                        {icon}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatGwei(gasPrice[speed])}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Gwei</div>
                      {estimate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          ≈ {estimate.estimatedCost[speed]} ETH
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Network Info */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Base Fee</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatGwei(gasPrice.baseFee)} Gwei</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Block</span>
                <span className="font-medium text-gray-900 dark:text-white">#{gasPrice.lastBlock}</span>
              </div>
              <div className="p-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Last updated</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 