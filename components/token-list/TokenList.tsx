import React, { useState, useMemo, useCallback } from 'react';
import { TokenListProps, SortField, SortDirection } from './types';
import { formatBalance, formatCurrency } from './utils';
import { TokenCard } from './TokenCard';
import { TOKEN_CONFIGS } from './tokenConfigs';

export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  onTokenSelect,
  className = '',
  showBalances = true,
  showPrices = true,
  variant = 'table'
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const tokenList = useMemo(() => {
    return tokens.map(symbol => ({
      ...TOKEN_CONFIGS[symbol],
      balance: '0', // This would be fetched from the wallet
      price: 0, // This would be fetched from an API
    }));
  }, [tokens]);

  const filteredAndSortedTokens = useMemo(() => {
    let result = tokenList;
    
    // Filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(token => 
        token.name.toLowerCase().includes(searchLower) ||
        token.symbol.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'balance':
          comparison = Number(a.balance || 0) - Number(b.balance || 0);
          break;
        case 'value':
          comparison = (Number(a.balance || 0) * (a.price || 0)) - 
                      (Number(b.balance || 0) * (b.price || 0));
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tokenList, search, sortField, sortDirection]);

  const renderVariant = () => {
    switch (variant) {
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedTokens.map((token) => (
              <TokenCard
                key={`${token.chainId}-${token.address}`}
                token={token}
                variant="default"
                onClick={onTokenSelect}
                showBalance={showBalances}
                showPrice={showPrices}
              />
            ))}
          </div>
        );

      default:
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Token
                  </th>
                  {showBalances && (
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('balance')}
                    >
                      Balance
                    </th>
                  )}
                  {showPrices && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('value')}
                      >
                        Value
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedTokens.map((token) => (
                  <tr 
                    key={`${token.chainId}-${token.address}`}
                    onClick={() => onTokenSelect?.(token)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {token.logoURI && (
                          <img 
                            src={token.logoURI} 
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{token.name}</div>
                          <div className="text-gray-500">{token.symbol}</div>
                        </div>
                      </div>
                    </td>
                    {showBalances && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatBalance(token.balance, token.decimals)}
                      </td>
                    )}
                    {showPrices && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {token.price ? formatCurrency(token.price) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {token.price && token.balance
                            ? formatCurrency(Number(token.balance) * token.price)
                            : '-'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {renderVariant()}
    </div>
  );
}; 