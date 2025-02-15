import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Lock, Unlock, Info } from 'lucide-react';

interface StakingPool {
  id: string;
  name: string;
  token: {
    symbol: string;
    logoURI: string;
    decimals: number;
  };
  apr: number;
  minStake: string;
  lockPeriod: number; // in days
  totalStaked: string;
}

interface StakingInterfaceProps {
  pools: StakingPool[];
  userBalance?: string;
  onStake?: (poolId: string, amount: string) => void;
  onUnstake?: (poolId: string, amount: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const StakingInterface: React.FC<StakingInterfaceProps> = ({
  pools,
  userBalance = '0',
  onStake,
  onUnstake,
  className = '',
  variant = 'default'
}) => {
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [amount, setAmount] = useState('');
  const [isStaking, setIsStaking] = useState(true);

  const handleAction = () => {
    if (!selectedPool || !amount) return;
    
    if (isStaking) {
      onStake?.(selectedPool.id, amount);
    } else {
      onUnstake?.(selectedPool.id, amount);
    }
    setAmount('');
  };

  const formatNumber = (value: string | number, decimals: number = 2) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staking Pools</h2>
        <div className="space-y-3">
          {pools.slice(0, 3).map((pool) => (
            <div
              key={pool.id}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => setSelectedPool(pool)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src={pool.token.logoURI}
                    alt={pool.token.symbol}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{pool.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      APR: {formatNumber(pool.apr)}%
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Staking Pools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pools.map((pool) => (
            <div
              key={pool.id}
              className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                selectedPool?.id === pool.id
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
              }`}
              onClick={() => setSelectedPool(pool)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Image
                  src={pool.token.logoURI}
                  alt={pool.token.symbol}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{pool.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{pool.token.symbol}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">APR</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {formatNumber(pool.apr)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Lock Period</span>
                  <span className="text-gray-900 dark:text-white">{pool.lockPeriod} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Min. Stake</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatNumber(pool.minStake)} {pool.token.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Staked</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatNumber(pool.totalStaked)} {pool.token.symbol}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPool && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsStaking(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isStaking
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Lock className="w-4 h-4 inline-block mr-2" />
                Stake
              </button>
              <button
                onClick={() => setIsStaking(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isStaking
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Unlock className="w-4 h-4 inline-block mr-2" />
                Unstake
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Balance: {formatNumber(userBalance)} {selectedPool.token.symbol}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount to ${isStaking ? 'stake' : 'unstake'}`}
                className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <button
                onClick={() => setAmount(userBalance)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs
                  text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                MAX
              </button>
            </div>

            <button
              onClick={handleAction}
              disabled={!amount || Number(amount) <= 0}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isStaking ? 'Stake' : 'Unstake'} {selectedPool.token.symbol}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
