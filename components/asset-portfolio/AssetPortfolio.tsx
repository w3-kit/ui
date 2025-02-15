import React, { useState } from 'react';
import Image from 'next/image';
import { Doughnut } from 'react-chartjs-2';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  value: number;
  change24h: number;
  logoURI: string;
  color: string;
}

interface AssetPortfolioProps {
  assets: Asset[];
  totalValue: number;
  totalChange24h: number;
  className?: string;
  variant?: 'default' | 'compact';
  onAssetClick?: (asset: Asset) => void;
}

export const AssetPortfolio: React.FC<AssetPortfolioProps> = ({
  assets,
  totalValue,
  totalChange24h,
  className = '',
  variant = 'default',
  onAssetClick
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const chartData = {
    labels: assets.map(asset => asset.symbol),
    datasets: [
      {
        data: assets.map(asset => asset.value),
        backgroundColor: assets.map(asset => asset.color),
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '70%',
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio</h2>
          <span className={`text-sm font-medium ${
            totalChange24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatPercent(totalChange24h)}
          </span>
        </div>
        
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {formatCurrency(totalValue)}
        </div>

        <div className="space-y-2">
          {assets.slice(0, 3).map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between p-2 hover:bg-gray-50 
                dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
              onClick={() => onAssetClick?.(asset)}
            >
              <div className="flex items-center space-x-3">
                <Image
                  src={asset.logoURI}
                  alt={asset.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {asset.symbol}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(asset.value)}
                </div>
                <div className={`text-xs ${
                  asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercent(asset.change24h)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Portfolio Value</h2>
          <div className="flex items-center space-x-2">
            {(['24h', '7d', '30d'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatCurrency(totalValue)}
            </div>
            <div className={`flex items-center text-sm font-medium ${
              totalChange24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {totalChange24h >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {formatPercent(totalChange24h)}
            </div>
          </div>
          
          <div className="relative h-48">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {assets.map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between p-3 hover:bg-gray-50 
                dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
              onClick={() => onAssetClick?.(asset)}
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={asset.logoURI}
                  alt={asset.symbol}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{asset.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{asset.symbol}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(asset.value)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {asset.balance} {asset.symbol}
                </div>
                <div className={`text-sm font-medium ${
                  asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercent(asset.change24h)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
