'use client';

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ChevronDown, ExternalLink } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset, AssetPortfolioProps, Timeframe } from './types';
import {
  cardAnimation,
  itemAnimation,
  formatCurrency,
  formatPercent,
  getChainName,
  getExplorerUrl,
} from './utils';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

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

// Asset item component with expandable details
const AssetItem: React.FC<{
  asset: Asset;
  onClick?: () => void;
  compact?: boolean;
  isExpanded: boolean;
  onExpand: (symbol: string) => void;
}> = ({ asset, onClick, compact, isExpanded, onExpand }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const token = asset.tokenConfig;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!compact) {
      onExpand(asset.symbol);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`${itemAnimation} bg-card rounded-lg overflow-hidden border
      ${!compact && 'hover:shadow-md transition-shadow duration-200'}`}
    >
      <div
        onClick={handleClick}
        className={`flex items-center justify-between p-4 cursor-pointer
          hover:bg-muted/50 ${cardAnimation} group`}
      >
        {/* Token Header Content */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-muted" />
            <img
              src={token.logoURI}
              alt={token.symbol}
              width={32}
              height={32}
              className="rounded-full relative z-10 transition-transform group-hover:scale-105"
            />
            <div
              className="absolute inset-0 rounded-full ring-2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ borderColor: asset.color }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{token.symbol}</span>
              {!compact && (
                <span className="text-sm text-muted-foreground truncate">
                  {token.name}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {Number(asset.balance).toFixed(token.decimals)} {token.symbol}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="font-medium">
              {formatCurrency(asset.value)}
            </div>
            <div className={`text-sm font-medium flex items-center justify-end space-x-1 ${
              asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {asset.change24h >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{formatPercent(asset.change24h)}</span>
            </div>
          </div>
          {!compact && (
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300
                ${isExpanded ? 'rotate-180' : ''} group-hover:text-foreground`}
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
          <div className="border-t border-border">
            <div className="p-4 bg-muted/50">
              {/* Token Charts Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    Price History
                  </h3>
                  <TimeframeSelector
                    selected={timeframe}
                    onChange={setTimeframe}
                  />
                </div>

                <div className="bg-card rounded-lg p-4">
                  <PriceChart
                    data={asset.priceHistory[timeframe]}
                    color={asset.color}
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{timeframe === '24h' ? 'Past 24 Hours' : timeframe === '7d' ? 'Past Week' : 'Past Month'}</span>
                    <span>Current: ${asset.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Token Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="font-medium">
                    ${asset.price.toLocaleString()}
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">24h Change</div>
                  <div className={`font-medium flex items-center ${
                    asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {asset.change24h >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {asset.change24h.toFixed(2)}%
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Holdings</div>
                  <div className="font-medium">
                    {Number(asset.balance).toFixed(token.decimals)} {token.symbol}
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Value</div>
                  <div className="font-medium">
                    ${asset.value.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Token Info Section */}
              <div className="mt-4 bg-card rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Contract Address</div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm">
                        {token.address}
                      </code>
                      <a
                        href={getExplorerUrl(token.address, token.chainId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
                      >
                       <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Chain</div>
                    <div className="text-sm">
                      {getChainName(token.chainId)}
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
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}> = ({ selected, onChange }) => {
  const timeframes = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' }
  ] as const;

  return (
    <div className="flex bg-muted rounded-lg p-1">
      {timeframes.map(({ value, label }) => (
        <Button
          key={value}
          variant={selected === value ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onChange(value)}
          className={selected === value ? 'shadow-sm' : ''}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

// Portfolio distribution doughnut chart
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
          <div className="text-center bg-card rounded-full p-4 w-36 h-36 flex items-center justify-center shadow-inner">
            {activeAsset ? (
              <div>
                <div className="text-sm font-medium">
                  {activeAsset.symbol}
                </div>
                <div className="text-lg font-bold">
                  ${activeAsset.value.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((activeAsset.value / totalValue) * 100).toFixed(1)}%
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-muted-foreground">
                  Total Value
                </div>
                <div className="text-lg font-bold">
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
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('24h');
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleExpand = (symbol: string) => {
    setExpandedAsset(expandedAsset === symbol ? null : symbol);
  };

  const activeIndex = selectedIndex ?? hoveredIndex;

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Portfolio</CardTitle>
            <span className={`text-sm font-medium ${
              totalChange24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatPercent(totalChange24h)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">
            {formatCurrency(totalValue)}
          </div>

          <div className="space-y-2">
            {assets.map((asset) => (
              <div key={asset.symbol} className="rounded-lg border border-border">
              {/* Token Header */}
              <div
                onClick={() => handleExpand(asset.symbol)}
                className="flex items-center justify-between p-3 cursor-pointer
                  hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-muted" />
                    <img
                      src={asset.tokenConfig.logoURI}
                      alt={asset.symbol}
                      width={24}
                      height={24}
                      className="rounded-full relative z-10 transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="font-medium">
                      {asset.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Number(asset.balance).toFixed(asset.tokenConfig.decimals)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">
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
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300
                      ${expandedAsset === asset.symbol ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Expandable Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out
                  ${expandedAsset === asset.symbol ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-3 bg-muted/50 border-t border-border">
                  {/* Price Chart - Only render if priceHistory exists */}
                  {asset.priceHistory && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">
                          Price History
                        </div>
                        <div className="flex items-center space-x-1">
                          {(['24h', '7d', '30d'] as const).map((t) => (
                            <Button
                              key={t}
                              variant={selectedTimeframe === t ? 'default' : 'ghost'}
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTimeframe(t);
                              }}
                            >
                              {t.toUpperCase()}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-card rounded-lg p-2">
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
                    <div className="bg-card rounded-lg p-2">
                      <div className="text-xs text-muted-foreground">Price</div>
                      <div className="text-sm font-medium">
                        {formatCurrency(asset.price)}
                      </div>
                    </div>
                    <div className="bg-card rounded-lg p-2">
                      <div className="text-xs text-muted-foreground">Value</div>
                      <div className="text-sm font-medium">
                        {formatCurrency(asset.value)}
                      </div>
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <a
                      href={getExplorerUrl(asset.tokenConfig.address, asset.tokenConfig.chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary hover:text-primary/80 text-xs flex items-center space-x-1"
                    >
                      <span>View on Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b border-border">
        <CardTitle>Portfolio Value</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-3xl font-bold mb-2">
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
                <Button
                  key={asset.symbol}
                  variant="ghost"
                  className={`w-full flex items-center justify-between p-3 h-auto ${
                    i === activeIndex ? 'bg-muted shadow-sm' : ''
                  }`}
                  onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    />
                    <span className={`text-sm ${
                      i === activeIndex ? 'font-medium' : 'text-muted-foreground'
                    }`}>
                      {asset.symbol}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm ${
                      i === activeIndex ? 'font-medium' : 'text-muted-foreground'
                    }`}>
                      ${asset.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {((asset.value / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </Button>
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

        <div className="mt-6 space-y-4">
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
      </CardContent>
    </Card>
  );
};
