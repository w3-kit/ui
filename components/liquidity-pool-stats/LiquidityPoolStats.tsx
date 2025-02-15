import React from 'react';
import { formatCurrency, formatNumber, formatPercentage } from './utils';
import { LiquidityPoolStatsProps } from './types';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export const LiquidityPoolStats: React.FC<LiquidityPoolStatsProps> = ({
  poolData,
  className = '',
  onTokenClick,
  variant = 'default'
}) => {
  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const ChangeIndicator = ({ value }: { value: number }) => (
    <span className={`flex items-center ${getChangeColor(value)}`}>
      {value > 0 ? <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />}
      {formatPercentage(Math.abs(value))}
    </span>
  );

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={poolData.token.logoURI}
                  alt={poolData.token.symbol}
                  fill
                  sizes="40px"
                  className="rounded-full object-contain"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">TVL</span>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {formatCurrency(poolData.tvl)}
                </span>
                <ChangeIndicator value={poolData.tvlChange24h} />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">APR</span>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {formatPercentage(poolData.apr)}
                </span>
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
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Pool Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src={poolData.token.logoURI}
                alt={poolData.token.symbol}
                fill
                sizes="40px"
                className="rounded-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {poolData.token.symbol}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {poolData.fee / 10000}% Fee Tier
              </p>
            </div>
          </div>
          <button
            onClick={() => onTokenClick?.(`${poolData.token.symbol}`)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 divide-y xs:divide-y-0 divide-gray-200 dark:divide-gray-700">
        {/* TVL */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">TVL</p>
          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
            {formatCurrency(poolData.tvl)}
          </p>
          <ChangeIndicator value={poolData.tvlChange24h} />
        </div>

        {/* Volume 24h */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
            {formatCurrency(poolData.volume24h)}
          </p>
          <ChangeIndicator value={poolData.volumeChange24h} />
        </div>

        {/* APR */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">APR</p>
          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
            {formatPercentage(poolData.apr)}
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatCurrency(poolData.feesEarned24h)} earned
          </span>
        </div>

        {/* Liquidity */}
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Liquidity</p>
          <div className="mt-1">
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {formatNumber(poolData.token.liquidity)} {poolData.token.symbol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
