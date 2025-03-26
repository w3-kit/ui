import React, { useState } from 'react';
import { formatCurrency, formatNumber, formatPercentage } from './utils';
import { LiquidityPoolStatsProps } from './types';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Info, Activity } from 'lucide-react';
import Image from 'next/image';

// Add Skeleton Component
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

// Add Loading Card Component
const LoadingCard = () => (
  <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6 relative">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
    <Skeleton className="h-8 w-32 mt-2" />
    <div className="flex items-center mt-2">
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const LiquidityPoolStats: React.FC<LiquidityPoolStatsProps> = ({
  poolData,
  className = '',
  onTokenClick,
  variant = 'default',
  isLoading = false
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const ChangeIndicator = ({ value }: { value: number }) => (
    <span className={`
      flex items-center ${getChangeColor(value)} 
      transition-all duration-300 ease-out
      transform hover:translate-x-1
    `}>
      {value > 0 ? 
        <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" /> : 
        <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
      }
      {formatPercentage(Math.abs(value))}
    </span>
  );

  const tooltipContent = {
    tvl: {
      title: "Total Value Locked",
      description: "The total value of all assets deposited in this liquidity pool",
      stats: [
        { label: "24h High", value: formatCurrency(poolData.tvl * 1.1) },
        { label: "24h Low", value: formatCurrency(poolData.tvl * 0.9) }
      ]
    },
    volume: {
      title: "24h Trading Volume",
      description: "Total value of all trades in the last 24 hours",
      stats: [
        { label: "Trades", value: formatNumber(poolData.transactions24h) },
        { label: "Avg Trade", value: formatCurrency(poolData.volume24h / poolData.transactions24h) }
      ]
    },
    apr: {
      title: "Annual Percentage Rate",
      description: "Estimated yearly earnings based on current trading volume",
      stats: [
        { label: "Daily Rate", value: formatPercentage(poolData.apr / 365) },
        { label: "Monthly Rate", value: formatPercentage(poolData.apr / 12) }
      ]
    },
    fees: {
      title: "Trading Fees",
      description: "Fees earned by liquidity providers in the last 24 hours",
      stats: [
        { label: "Fee Tier", value: `${poolData.fee / 10000}%` },
        { label: "Per $1M", value: formatCurrency(10000 * (poolData.fee / 10000)) }
      ]
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    subtitle, 
    tooltipKey, 
    icon
  }: { 
    title: string;
    value: string;
    change?: number;
    subtitle?: string;
    tooltipKey: keyof typeof tooltipContent;
    icon?: React.ReactNode;
  }) => {
    return (
      <div 
        className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6 relative group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              {title}
            </span>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(tooltipKey)}
                onMouseLeave={() => setShowTooltip(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
              {showTooltip === tooltipKey && (
                <div 
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    bg-gray-900 dark:bg-gray-700 text-white p-4 rounded-lg text-sm
                    shadow-lg z-50 w-64 animate-fade-in pointer-events-none"
                >
                  <h4 className="font-medium mb-1">{tooltipContent[tooltipKey].title}</h4>
                  <p className="text-gray-300 text-xs mb-3">{tooltipContent[tooltipKey].description}</p>
                  <div className="grid grid-cols-2 gap-3 border-t border-gray-600 pt-2">
                    {tooltipContent[tooltipKey].stats.map((stat, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-xs text-gray-400">{stat.label}</p>
                        <p className="text-sm font-medium">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full 
                    border-8 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                </div>
              )}
            </div>
          </div>
          {icon}
        </div>
        <div className="transition-all duration-300 ease-out">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <ChangeIndicator value={change} />
              <span className="ml-2 text-sm text-gray-500">24h change</span>
            </div>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>
      </div>
    );
  };

  // Loading State for Compact Variant
  if (isLoading && variant === 'compact') {
    return (
      <div className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 
        dark:border-gray-700 shadow-sm p-4 ${className}
      `}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    );
  }

  // Loading State for Default Variant
  if (isLoading) {
    return (
      <div className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 
        dark:border-gray-700 shadow-sm ${className}
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-lg border border-gray-200 
          dark:border-gray-700 shadow-sm hover:shadow-md 
          transition-all duration-300 ease-out ${className}
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex-shrink-0 group">
                <Image
                  src={poolData.token.logoURI}
                  alt={poolData.token.symbol}
                  fill
                  sizes="40px"
                  className="rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {poolData.token.symbol}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {poolData.fee / 10000}% Fee Tier
                </p>
              </div>
            </div>
            <button
              onClick={() => onTokenClick?.(poolData.token.symbol)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 
                dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 
                dark:hover:bg-gray-700 transition-all duration-200 
                hover:scale-110 active:scale-95"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* TVL */}
            <div className="relative group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">TVL</span>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip('tvl')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                  {showTooltip === 'tvl' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                      bg-gray-900 dark:bg-gray-700 text-white p-3 rounded-lg text-sm
                      shadow-lg z-50 w-56 animate-fade-in pointer-events-none">
                      <h4 className="font-medium mb-1">{tooltipContent.tvl.title}</h4>
                      <p className="text-gray-300 text-xs">{tooltipContent.tvl.description}</p>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full 
                        border-8 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatCurrency(poolData.tvl)}
                </p>
                <ChangeIndicator value={poolData.tvlChange24h} />
              </div>
            </div>

            {/* APR */}
            <div className="relative group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">APR</span>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip('apr')}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                  {showTooltip === 'apr' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                      bg-gray-900 dark:bg-gray-700 text-white p-3 rounded-lg text-sm
                      shadow-lg z-50 w-56 animate-fade-in pointer-events-none">
                      <h4 className="font-medium mb-1">{tooltipContent.apr.title}</h4>
                      <p className="text-gray-300 text-xs">{tooltipContent.apr.description}</p>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full 
                        border-8 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatPercentage(poolData.apr)}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(poolData.feesEarned24h)} earned
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg border border-gray-200 
      dark:border-gray-700 shadow-sm hover:shadow-md 
      transition-all duration-300 ease-out
      h-full ${className}
    `}>
      {/* Pool Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex-shrink-0 group">
              <Image
                src={poolData.token.logoURI}
                alt={poolData.token.symbol}
                fill
                sizes="40px"
                className="rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {poolData.token.symbol}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {poolData.fee / 10000}% Fee Tier
              </p>
            </div>
          </div>
          <button
            onClick={() => onTokenClick?.(`${poolData.token.symbol}`)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 
              dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 
              dark:hover:bg-gray-700 transition-all duration-200 
              hover:scale-110 active:scale-95"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        <StatCard
          title="TVL"
          value={formatCurrency(poolData.tvl)}
          change={poolData.tvlChange24h}
          tooltipKey="tvl"
          icon={<Activity className="w-5 h-5 text-blue-500" />}
        />

        <StatCard
          title="Volume (24h)"
          value={formatCurrency(poolData.volume24h)}
          change={poolData.volumeChange24h}
          tooltipKey="volume"
          icon={<Activity className="w-5 h-5 text-green-500" />}
        />

        <StatCard
          title="APR"
          value={formatPercentage(poolData.apr)}
          subtitle={`${formatCurrency(poolData.feesEarned24h)} earned`}
          tooltipKey="apr"
        />

        <StatCard
          title="Fees (24h)"
          value={formatCurrency(poolData.feesEarned24h)}
          subtitle={`${poolData.fee / 10000}% fee tier`}
          tooltipKey="fees"
        />
      </div>
    </div>
  );
};
