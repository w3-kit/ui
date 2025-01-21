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
        return { label: 'Economy', time: '5+ mins', icon: '🐢' };
      case 'medium':
        return { label: 'Standard', time: '< 2 mins', icon: '🚶' };
      case 'high':
        return { label: 'Fast', time: '< 30 secs', icon: '⚡' };
    }
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Gas Calculator</h2>
        <p className="text-sm text-gray-500 mt-1">
          Estimate transaction costs based on current network conditions
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Gas Limit Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Gas Limit</label>
            <div className="flex space-x-2">
              {[21000, 65000, 100000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setGasLimit(preset)}
                  className={`px-2 py-1 text-xs rounded transition-colors
                    ${gasLimit === preset
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
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
              className="w-full px-3 py-2 text-sm border rounded-md
                focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter gas limit"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-gray-500">units</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-[120px] bg-gray-100 rounded-lg" />
            <div className="h-[80px] bg-gray-100 rounded-lg" />
          </div>
        ) : error ? (
          <div className="p-3 border border-red-200 rounded-lg bg-red-50 text-sm text-red-600">
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
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl" role="img" aria-label={label}>
                        {icon}
                      </span>
                      <span className="text-xs text-gray-500">{time}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">{label}</div>
                      <div className="text-2xl font-bold">
                        {formatGwei(gasPrice[speed])}
                      </div>
                      <div className="text-sm text-gray-500">Gwei</div>
                      {estimate && (
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                          ≈ {estimate.estimatedCost[speed]} ETH
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Network Info */}
            <div className="border rounded-lg divide-y">
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Fee</span>
                <span className="font-medium">{formatGwei(gasPrice.baseFee)} Gwei</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Block</span>
                <span className="font-medium">#{gasPrice.lastBlock}</span>
              </div>
              <div className="p-3 flex justify-between items-center text-xs text-gray-500">
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