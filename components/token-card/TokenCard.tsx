import React from 'react';
import { Token } from '../token-list/types';
import { formatBalance, formatCurrency } from '../token-list/utils';

interface TokenCardProps {
  token: Token;
  variant?: 'default' | 'compact' | 'expanded' | 'minimal';
  onClick?: (token: Token) => void;
  showBalance?: boolean;
  showPrice?: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  variant = 'default',
  onClick,
  showBalance = true,
  showPrice = true,
}) => {
  const variants = {
    default: (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer
          border border-gray-200 dark:border-gray-700"
        onClick={() => onClick?.(token)}
      >
        <div className="flex items-center space-x-3">
          <img 
            src={token.logoURI} 
            alt={token.symbol}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{token.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</p>
          </div>
        </div>
        {(showBalance || showPrice) && (
          <div className="mt-3 space-y-1">
            {showBalance && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Balance: {formatBalance(token.balance, token.decimals)} {token.symbol}
              </p>
            )}
            {showPrice && (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Price: {token.price ? formatCurrency(token.price) : '-'}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Value: {token.price && token.balance
                    ? formatCurrency(Number(token.balance) * token.price)
                    : '-'}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    ),

    compact: (
      <div 
        className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-2 
          hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700"
        onClick={() => onClick?.(token)}
      >
        <div className="flex items-center space-x-3">
          <img 
            src={token.logoURI} 
            alt={token.symbol}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium text-gray-900 dark:text-white">{token.symbol}</span>
        </div>
        {showBalance && (
          <span className="text-gray-600 dark:text-gray-300">
            {formatBalance(token.balance, token.decimals)}
          </span>
        )}
      </div>
    ),

    expanded: (
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer
          border border-gray-200 dark:border-gray-700"
        onClick={() => onClick?.(token)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img 
              src={token.logoURI} 
              alt={token.symbol}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{token.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{token.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Chain ID</p>
            <p className="font-medium text-gray-900 dark:text-white">{token.chainId}</p>
          </div>
        </div>
        {(showBalance || showPrice) && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            {showBalance && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatBalance(token.balance, token.decimals)} {token.symbol}
                </p>
              </div>
            )}
            {showPrice && (
              <>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {token.price ? formatCurrency(token.price) : '-'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {token.price && token.balance
                      ? formatCurrency(Number(token.balance) * token.price)
                      : '-'}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    ),

    minimal: (
      <div 
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full 
          bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
        onClick={() => onClick?.(token)}
      >
        <img 
          src={token.logoURI} 
          alt={token.symbol}
          className="w-5 h-5 rounded-full"
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white">{token.symbol}</span>
      </div>
    ),
  };

  return variants[variant];
}; 