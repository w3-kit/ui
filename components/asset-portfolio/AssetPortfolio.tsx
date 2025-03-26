'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown, ChevronDown, ExternalLink } from 'lucide-react';
import { TOKEN_CONFIGS } from '@/config/tokens';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Animation constants
const cardAnimation = "transition-all duration-300 ease-in-out";
const itemAnimation = "animate-in fade-in-50 duration-300";

// Add interface for candlestick data
interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Asset {
  symbol: keyof typeof TOKEN_CONFIGS;
  balance: string;
  price: number;
  value: number;
  change24h: number;
  color: string;
  priceHistory: {
    '24h': number[];
    '7d': number[];
    '30d': number[];
  };
  candleData: {
    '24h': CandleData[];
    '7d': CandleData[];
    '30d': CandleData[];
  };
}

interface AssetPortfolioProps {
  assets: Asset[];
  totalValue: number;
  totalChange24h: number;
  className?: string;
  variant?: 'default' | 'compact';
  onAssetClick?: (asset: Asset) => void;
}

// Simple price chart using div bars
const PriceChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return (
    <div className="h-32 flex items-end space-x-1">
      {data.map((value, i) => {
        const height = ((value - min) / range) * 100;
        return (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-200 hover:opacity-80"
            style={{
              height: `${height}%`,
              backgroundColor: color,
              minHeight: '4px'
            }}
          />
        );
      })}
    </div>
  );
};

// Update the AssetItem expanded view
const AssetItem: React.FC<{
  asset: Asset;
  onClick?: () => void;
  compact?: boolean;
  isExpanded: boolean;
  onExpand: (symbol: string) => void;
}> = ({ asset, onClick, compact, isExpanded, onExpand }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const token = TOKEN_CONFIGS[asset.symbol];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!compact) {
      onExpand(asset.symbol);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`${itemAnimation} bg-white dark:bg-gray-800 rounded-lg overflow-hidden 
      ${!compact && 'hover:shadow-md transition-shadow duration-200'}`}
    >
      <div
        onClick={handleClick}
        className={`flex items-center justify-between p-4 cursor-pointer 
          hover:bg-gray-50 dark:hover:bg-gray-700/50 ${cardAnimation} group`}
      >
        {/* Token Header Content */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gray-50 dark:bg-gray-700" />
            <Image
              src={token.logoURI}
              alt={token.symbol}
              width={32}
              height={32}
              className="rounded-full relative z-10 transition-transform group-hover:scale-105"
              priority
            />
            <div 
              className="absolute inset-0 rounded-full ring-2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ borderColor: asset.color }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-white">{token.symbol}</span>
              {!compact && (
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {token.name}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {Number(asset.balance).toFixed(token.decimals)} {token.symbol}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="font-medium text-gray-900 dark:text-white">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(asset.value)}
            </div>
            <div className={`text-sm font-medium flex items-center justify-end space-x-1 ${
              asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {asset.change24h >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{`${asset.change24h >= 0 ? '+' : ''}${asset.change24h.toFixed(2)}%`}</span>
            </div>
          </div>
          {!compact && (
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 
                ${isExpanded ? 'rotate-180' : ''} group-hover:text-gray-600 dark:group-hover:text-gray-300`}
            />
          )}
        </div>
      </div>

      {/* Dropdown Content */}
      {!compact && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out
            ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="border-t border-gray-100 dark:border-gray-700">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
              {/* Token Charts Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Price History
                  </h3>
                  <TimeframeSelector
                    selected={timeframe}
                    onChange={setTimeframe}
                  />
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <PriceChart
                    data={asset.priceHistory[timeframe]}
                    color={asset.color}
                  />
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>{timeframe === '24h' ? 'Past 24 Hours' : timeframe === '7d' ? 'Past Week' : 'Past Month'}</span>
                    <span>Current: ${asset.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Token Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Price</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${asset.price.toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">24h Change</div>
                  <div className={`font-medium flex items-center ${
                    asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {asset.change24h >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {asset.change24h.toFixed(2)}%
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Holdings</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {Number(asset.balance).toFixed(token.decimals)} {token.symbol}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Value</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${asset.value.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Token Info Section */}
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Contract Address</div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-gray-900 dark:text-white">
                        {token.address}
                      </code>
                      <a
                        href={`https://etherscan.io/token/${token.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 text-sm flex items-center space-x-1"
                      >
                       <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Chain</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {token.chainId === 1 ? 'Ethereum Mainnet' : `Chain ID: ${token.chainId}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TimeframeSelector: React.FC<{
  selected: '24h' | '7d' | '30d';
  onChange: (timeframe: '24h' | '7d' | '30d') => void;
}> = ({ selected, onChange }) => {
  const timeframes = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' }
  ] as const;

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {timeframes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            selected === value
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

// Update the PortfolioDistributionChart component
const PortfolioDistributionChart: React.FC<{
  assets: Asset[];
  totalValue: number;
  selectedIndex: number | null;
  hoveredIndex: number | null;
}> = ({ assets, totalValue, selectedIndex, hoveredIndex }) => {
  const activeIndex = selectedIndex ?? hoveredIndex;
  const activeAsset = activeIndex !== null ? assets[activeIndex] : null;

  const data = {
    labels: assets.map(a => a.symbol),
    datasets: [
      {
        data: assets.map(a => a.value),
        backgroundColor: assets.map((a, i) => 
          i === activeIndex ? a.color : `${a.color}80`
        ),
        borderColor: '#ffffff',
        borderWidth: assets.map((_, i) => 
          i === activeIndex ? 2 : 1
        ),
        hoverOffset: 15,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[280px] h-[280px]">
        {/* Chart */}
        <div className="absolute inset-0">
          <Doughnut data={data} options={options} />
        </div>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white dark:bg-gray-800 rounded-full p-4 w-36 h-36 flex items-center justify-center shadow-inner">
            {activeAsset ? (
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {activeAsset.symbol}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ${activeAsset.value.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {((activeAsset.value / totalValue) * 100).toFixed(1)}%
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Value
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  ${totalValue.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AssetPortfolio: React.FC<AssetPortfolioProps> = ({
  assets,
  totalValue,
  totalChange24h,
  className = '',
  variant = 'default',
  onAssetClick
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleExpand = (symbol: string) => {
    setExpandedAsset(expandedAsset === symbol ? null : symbol);
  };

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

  const activeIndex = selectedIndex ?? hoveredIndex;

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
          {assets.map((asset) => (
            <div key={asset.symbol} className="rounded-lg border border-gray-100 dark:border-gray-700">
              {/* Token Header */}
              <div
                onClick={() => handleExpand(asset.symbol)}
                className="flex items-center justify-between p-3 cursor-pointer
                  hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gray-50 dark:bg-gray-700" />
                    <Image
                      src={TOKEN_CONFIGS[asset.symbol].logoURI}
                      alt={asset.symbol}
                      width={24}
                      height={24}
                      className="rounded-full relative z-10 transition-transform group-hover:scale-105"
                      priority
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {asset.symbol}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {Number(asset.balance).toFixed(TOKEN_CONFIGS[asset.symbol].decimals)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(asset.value)}
                    </div>
                    <div className={`text-sm font-medium flex items-center justify-end ${
                      asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {asset.change24h >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      <span>{formatPercent(asset.change24h)}</span>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300
                      ${expandedAsset === asset.symbol ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Expandable Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out
                  ${expandedAsset === asset.symbol ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                  {/* Price Chart - Only render if priceHistory exists */}
                  {asset.priceHistory && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Price History
                        </div>
                        <div className="flex items-center space-x-1">
                          {(['24h', '7d', '30d'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTimeframe(t);
                              }}
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                selectedTimeframe === t
                                  ? 'bg-blue-500 text-white'
                                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                              }`}
                            >
                              {t.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                        {asset.priceHistory[selectedTimeframe] && (
                          <PriceChart
                            data={asset.priceHistory[selectedTimeframe]}
                            color={asset.color}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Token Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Price</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(asset.price)}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(asset.value)}
                      </div>
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href={`https://etherscan.io/token/${TOKEN_CONFIGS[asset.symbol].address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-500 hover:text-blue-600 text-xs flex items-center space-x-1"
                    >
                      <span>View on Etherscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatCurrency(totalValue)}
            </div>
            <div className={`flex items-center text-sm font-medium mb-4 ${
              totalChange24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {totalChange24h >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {formatPercent(totalChange24h)}
            </div>

            {/* Single Column Interactive Legend */}
            <div className="space-y-2">
              {assets.map((asset, i) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all
                    ${i === activeIndex 
                      ? 'bg-gray-100 dark:bg-gray-700 shadow-sm' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className={`text-sm ${
                      i === activeIndex
                        ? 'text-gray-900 dark:text-white font-medium'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {asset.symbol}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm ${
                      i === activeIndex
                        ? 'text-gray-900 dark:text-white font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      ${asset.value.toLocaleString()}
                    </span>
                    <span className={`text-xs ${
                      i === activeIndex
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {((asset.value / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative flex items-center justify-center min-h-[320px]">
            <PortfolioDistributionChart
              assets={assets}
              totalValue={totalValue}
              selectedIndex={selectedIndex}
              hoveredIndex={hoveredIndex}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {assets.map((asset) => (
            <AssetItem
              key={asset.symbol}
              asset={asset}
              onClick={() => onAssetClick?.(asset)}
              isExpanded={expandedAsset === asset.symbol}
              onExpand={handleExpand}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
