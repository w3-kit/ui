import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface ENSResolverProps {
  onResolve?: (result: {
    address?: string;
    ensName?: string;
    avatar?: string;
  }) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const ENSResolver: React.FC<ENSResolverProps> = ({
  onResolve,
  className = '',
  variant = 'default'
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    address?: string;
    ensName?: string;
    avatar?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isENS = (value: string) => value.toLowerCase().endsWith('.eth');
  const isAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value);

  const handleResolve = async () => {
    if (!input) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual ENS resolution logic
      await new Promise(resolve => setTimeout(resolve, 1000));

      let mockResult;
      if (isENS(input)) {
        mockResult = {
          ensName: input,
          address: '0x1234...5678',
          avatar: 'https://avatar.com/example.png'
        };
      } else if (isAddress(input)) {
        mockResult = {
          address: input,
          ensName: 'example.eth',
          avatar: 'https://avatar.com/example.png'
        };
      } else {
        throw new Error('Invalid input format');
      }

      setResult(mockResult);
      onResolve?.(mockResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 w-full ${className}`}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ENS name or address"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <button
            onClick={handleResolve}
            disabled={!input || isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isLoading ? 'Loading...' : 'Resolve'}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs sm:text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
        {result && (
          <div className="mt-3 text-xs sm:text-sm">
            <p className="text-gray-600 dark:text-gray-300 break-words">
              {result.ensName && (
                <span className="font-medium text-gray-900 dark:text-white">{result.ensName}</span>
              )}
              {result.ensName && result.address && (
                <ArrowRight className="inline-block mx-2 w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {result.address && (
                <span className="font-medium text-gray-900 dark:text-white break-all">{result.address}</span>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-full ${className}`}>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">ENS Resolver</h2>
      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter ENS name or Ethereum address"
            className="w-full px-4 py-2 sm:py-3 pl-10 sm:pl-11 text-sm sm:text-base 
              border border-gray-200 dark:border-gray-700 rounded-lg
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <Search className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
        </div>

        <button
          onClick={handleResolve}
          disabled={!input || isLoading}
          className="w-full px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          {isLoading ? 'Resolving...' : 'Resolve'}
        </button>

        {error && (
          <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 
            rounded-lg text-xs sm:text-sm"
          >
            {error}
          </div>
        )}

        {result && (
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg space-y-3">
            {result.avatar && (
              <img 
                src={result.avatar} 
                alt="ENS Avatar" 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
              />
            )}
            <div className="space-y-2">
              {result.ensName && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ENS Name</span>
                  <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">
                    {result.ensName}
                  </span>
                </div>
              )}
              {result.address && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Address</span>
                  <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-white break-all">
                    {result.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
