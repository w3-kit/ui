import React from 'react';
import Image from 'next/image';
import { formatCurrency, formatBalance } from '../token-list/utils';

interface Token {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  decimals: number;
  logoURI: string;
}

interface WalletBalanceProps {
  tokens: Token[];
  onTokenClick?: (token: Token) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  tokens,
  onTokenClick,
  className = '',
  variant = 'default'
}) => {
  const totalValue = tokens.reduce(
    (sum, token) => sum + (Number(token.balance) * (token.price || 0)),
    0
  );

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 w-full ${className}`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Wallet Balance
          </h2>
          <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalValue)}
          </span>
        </div>
        <div className="space-y-2">
          {tokens.slice(0, 3).map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                rounded-lg cursor-pointer transition-colors"
              onClick={() => onTokenClick?.(token)}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Image
                  src={token.logoURI}
                  alt={token.symbol}
                  width={20}
                  height={20}
                  className="rounded-full w-5 h-5 sm:w-6 sm:h-6"
                />
                <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  {token.symbol}
                </span>
              </div>
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {formatBalance(token.balance, token.decimals)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full ${className}`}>
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
          Total Balance
        </h2>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalValue)}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[300px] sm:max-h-[400px] 
        overflow-y-auto scrollbar-thin">
        {tokens.map((token) => {
          const tokenValue = Number(token.balance) * (token.price || 0);
          return (
            <div
              key={token.symbol}
              className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer 
                transition-colors"
              onClick={() => onTokenClick?.(token)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <Image
                    src={token.logoURI}
                    alt={token.symbol}
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {token.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {token.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                    {formatBalance(token.balance, token.decimals)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(tokenValue)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
