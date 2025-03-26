import React, { useState } from 'react';
import Image from 'next/image';
import { formatCurrency, formatBalance } from '../token-list/utils';

interface Token {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  decimals: number;
  logoURI: string;
  priceChange24h?: number; // 24h price change percentage
  lastUpdated?: string; // Timestamp of last balance update
}

interface WalletBalanceProps {
  tokens: Token[];
  onTokenClick?: (token: Token) => void;
  className?: string;
  variant?: 'default' | 'compact';
  onRefresh?: () => Promise<void>; // Callback to refresh balances
}

// Animation keyframes
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInFromRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .animate-slideIn {
    animation: slideInFromRight 0.3s ease-out;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite ease-in-out;
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

type SortOption = 'balance' | 'name' | 'value' | 'change';

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  tokens,
  onTokenClick,
  className = '',
  variant = 'default',
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAllTokens, setShowAllTokens] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const totalValue = tokens.reduce(
    (sum, token) => sum + (Number(token.balance) * (token.price || 0)),
    0
  );

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
  };

  const handleTokenClick = (token: Token) => {
    setSelectedToken(selectedToken?.symbol === token.symbol ? null : token);
    onTokenClick?.(token);
  };

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'balance':
        comparison = Number(a.balance) - Number(b.balance);
        break;
      case 'value':
        comparison = (Number(a.balance) * (a.price || 0)) - (Number(b.balance) * (b.price || 0));
        break;
      case 'change':
        comparison = (a.priceChange24h || 0) - (b.priceChange24h || 0);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const displayTokens = variant === 'compact' && !showAllTokens 
    ? sortedTokens.slice(0, 3) 
    : sortedTokens;

  if (variant === 'compact') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 w-full animate-fadeIn ${className}`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Wallet Balance
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalValue)}
              </span>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Refresh balances"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Search input for compact view */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {displayTokens.map((token, index) => {
              const tokenValue = Number(token.balance) * (token.price || 0);
              const isSelected = selectedToken?.symbol === token.symbol;
              
              return (
                <div
                  key={token.symbol}
                  className={`flex items-center justify-between p-2 
                    ${isSelected ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} 
                    rounded-lg cursor-pointer transition-all duration-200 animate-slideIn`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleTokenClick(token)}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="relative">
                      <Image
                        src={token.logoURI}
                        alt={token.symbol}
                        width={24}
                        height={24}
                        className="rounded-full w-6 h-6 sm:w-7 sm:h-7 object-contain bg-white dark:bg-gray-700"
                        onError={(e) => {
                          // Fallback for failed image loads
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {token.priceChange24h !== undefined && (
                        <div 
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center
                            ${token.priceChange24h > 0 
                              ? 'bg-green-500' 
                              : token.priceChange24h < 0 
                                ? 'bg-red-500' 
                                : 'bg-gray-400'}`}
                          title={`${token.priceChange24h > 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}% (24h)`}
                        >
                          {token.priceChange24h > 0 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-2 h-2">
                              <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9a1 1 0 01-1-1v-2a1 1 0 00-2 0v2a1 1 0 01-1 1H4a1 1 0 110-2h1v-1H4a1 1 0 110-2h1V9H4a1 1 0 010-2h1a1 1 0 011 1v2a1 1 0 002 0V8a1 1 0 011-1h2z" clipRule="evenodd" />
                            </svg>
                          ) : token.priceChange24h < 0 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-2 h-2">
                              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px] sm:max-w-[150px]">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                      {formatBalance(token.balance, token.decimals)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(tokenValue)}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {sortedTokens.length === 0 && (
              <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No tokens found
              </div>
            )}
            
            {sortedTokens.length > 3 && (
              <button
                onClick={() => setShowAllTokens(!showAllTokens)}
                className="w-full py-2 mt-1 text-xs font-medium text-blue-600 dark:text-blue-400 
                  hover:text-blue-800 dark:hover:text-blue-300 transition-colors rounded-lg
                  hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                {showAllTokens ? 'Show Less' : `Show All (${sortedTokens.length})`}
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full animate-fadeIn ${className}`}>
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Total Balance
            </h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Refresh balances"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalValue)}
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {tokens.length} tokens in wallet
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-3">
            {/* Search input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-9 border border-gray-200 dark:border-gray-700 rounded-lg 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Sort buttons */}
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                <button
                  onClick={() => handleSort('value')}
                  className={`h-[42px] px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg
                    ${sortBy === 'value' 
                      ? 'bg-blue-500 text-white border-blue-500 dark:border-blue-500' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Value {sortBy === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('name')}
                  className={`h-[42px] px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg
                    ${sortBy === 'name' 
                      ? 'bg-blue-500 text-white border-blue-500 dark:border-blue-500' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('balance')}
                  className={`h-[42px] px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg
                    ${sortBy === 'balance' 
                      ? 'bg-blue-500 text-white border-blue-500 dark:border-blue-500' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  Balance {sortBy === 'balance' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('change')}
                  className={`h-[42px] px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg
                    ${sortBy === 'change' 
                      ? 'bg-blue-500 text-white border-blue-500 dark:border-blue-500' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  24h {sortBy === 'change' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[300px] sm:max-h-[400px] 
          overflow-y-auto scrollbar-thin">
          {sortedTokens.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No tokens found matching your search
            </div>
          ) : (
            sortedTokens.map((token, index) => {
              const tokenValue = Number(token.balance) * (token.price || 0);
              const isSelected = selectedToken?.symbol === token.symbol;
              
              return (
                <div
                  key={token.symbol}
                  className={`p-3 sm:p-4 
                    ${isSelected ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} 
                    cursor-pointer transition-colors animate-slideIn`}
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => handleTokenClick(token)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <div className="relative">
                        <Image
                          src={token.logoURI}
                          alt={token.symbol}
                          width={40}
                          height={40}
                          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 object-contain bg-white dark:bg-gray-700"
                          onError={(e) => {
                            // Fallback for failed image loads
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {token.priceChange24h !== undefined && (
                          <div 
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center
                              ${token.priceChange24h > 0 
                                ? 'bg-green-500' 
                                : token.priceChange24h < 0 
                                  ? 'bg-red-500' 
                                  : 'bg-gray-400'}`}
                          >
                            {token.priceChange24h > 0 ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                                <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9a1 1 0 01-1-1v-2a1 1 0 00-2 0v2a1 1 0 01-1 1H4a1 1 0 110-2h1v-1H4a1 1 0 110-2h1V9H4a1 1 0 010-2h1a1 1 0 011 1v2a1 1 0 002 0V8a1 1 0 011-1h2z" clipRule="evenodd" />
                              </svg>
                            ) : token.priceChange24h < 0 ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                          {token.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <span>{token.symbol}</span>
                          {token.priceChange24h !== undefined && (
                            <span 
                              className={`ml-2 ${
                                token.priceChange24h > 0 
                                  ? 'text-green-500' 
                                  : token.priceChange24h < 0 
                                    ? 'text-red-500' 
                                    : 'text-gray-400'
                              }`}
                            >
                              {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                            </span>
                          )}
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
                  
                  {/* Expanded token details */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-750 rounded-lg p-3">
                        <div className="border-r border-gray-200 dark:border-gray-700 pr-3">
                          <div className="text-gray-500 dark:text-gray-400 mb-1 text-xs">Price</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(token.price || 0)}
                          </div>
                        </div>
                        <div className="pl-3">
                          <div className="text-gray-500 dark:text-gray-400 mb-1 text-xs">Value</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(tokenValue)}
                          </div>
                        </div>
                        {token.priceChange24h !== undefined && (
                          <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
                            <div className="text-gray-500 dark:text-gray-400 mb-1 text-xs">24h Change</div>
                            <div className={`font-medium text-xs ${
                              token.priceChange24h > 0 
                                ? 'text-green-500' 
                                : token.priceChange24h < 0 
                                  ? 'text-red-500' 
                                  : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button 
                          className="py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 
                            rounded hover:bg-blue-200 dark:hover:bg-blue-800/70 transition-colors flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            // This would be implemented to send the token
                            alert(`Send ${token.symbol} functionality would go here`);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send
                        </button>
                        <button 
                          className="py-1.5 sm:py-2 text-xs sm:text-sm bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 
                            rounded hover:bg-green-200 dark:hover:bg-green-800/70 transition-colors flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            // This would be implemented to swap the token
                            alert(`Swap ${token.symbol} functionality would go here`);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Swap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
