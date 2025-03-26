import React, { useState, useEffect, useMemo } from 'react';
import { NFTCard } from '../nft-card/NFTCard';
import { NFTCollectionGridProps } from './types';

// Custom debounce function without lodash
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Add this CSS class for grid transitions
const gridTransitionClass = "transition-all duration-500 ease-in-out transform";

export const NFTCollectionGrid: React.FC<NFTCollectionGridProps> = ({
  nfts,
  onNFTClick,
  onOwnerClick,
  className = '',
  variant = 'default',
}) => {
  // State for search and filters
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 300);
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('recent');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique chains from NFTs
  const availableChains = useMemo(() => {
    const chains = new Map();
    nfts.forEach(nft => {
      if (nft.chainId && !chains.has(nft.chainId)) {
        chains.set(nft.chainId, {
          id: nft.chainId,
          name: getChainName(nft.chainId)
        });
      }
    });
    return Array.from(chains.values());
  }, [nfts]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setIsLoading(true);
  };

  // Effect to handle loading state when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm]);

  // Filter and sort NFTs
  const filteredNFTs = useMemo(() => {
    let result = [...nfts];
    
    // Apply search filter
    if (debouncedSearchTerm) {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      result = result.filter(nft => 
        nft.name.toLowerCase().includes(lowerSearch) || 
        nft.collection?.toLowerCase().includes(lowerSearch) ||
        nft.description?.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply chain filter
    if (selectedChain !== null) {
      result = result.filter(nft => nft.chainId === selectedChain);
    }
    
    // Apply sorting
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Assuming there's a timestamp or id that can be used for "recent" sorting
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    
    return result;
  }, [nfts, debouncedSearchTerm, selectedChain, sortBy]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedChain(null);
    setSortBy('recent');
    // Reset the search input value
    const searchInput = document.getElementById('nft-search') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="nft-search"
            type="search"
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg 
              bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white
              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Search by name, collection or description..."
            onChange={handleSearchChange}
            value={searchInput}
          />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Chain Filter */}
            <div className="relative inline-block">
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                  text-gray-900 dark:text-white text-sm rounded-lg 
                  focus:ring-blue-500 focus:border-blue-500 
                  p-2.5 pr-8 appearance-none cursor-pointer transition-all duration-200"
                value={selectedChain || ''}
                onChange={(e) => setSelectedChain(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Chains</option>
                {availableChains.map(chain => (
                  <option key={chain.id} value={chain.id}>{chain.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Sort By */}
            <div className="relative inline-block">
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                  text-gray-900 dark:text-white text-sm rounded-lg 
                  focus:ring-blue-500 focus:border-blue-500 
                  p-2.5 pr-8 appearance-none cursor-pointer transition-all duration-200"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'recent')}
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name (A-Z)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Filter Information */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active Filters:
          </span>
          
          {/* Show active filters as tags */}
          <div className="flex flex-wrap gap-2">
            {debouncedSearchTerm && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Search: {debouncedSearchTerm}
                <button 
                  onClick={() => {
                    setSearchInput('');
                    const searchInput = document.getElementById('nft-search') as HTMLInputElement;
                    if (searchInput) searchInput.value = '';
                  }}
                  className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {selectedChain !== null && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Chain: {getChainName(selectedChain)}
                <button 
                  onClick={() => setSelectedChain(null)}
                  className="ml-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {sortBy !== 'recent' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Sort: {sortBy === 'name' ? 'Name (A-Z)' : 'Most Recent'}
                <button 
                  onClick={() => setSortBy('recent')}
                  className="ml-1.5 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {/* If no filters are active */}
            {!debouncedSearchTerm && selectedChain === null && sortBy === 'recent' && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                No filters applied
              </span>
            )}
          </div>
          
          {/* Clear all filters button */}
          {(debouncedSearchTerm || selectedChain !== null || sortBy !== 'recent') && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 
                transition-colors duration-200 flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>
      
      {/* Results Count and View Mode Toggle */}
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-white">{filteredNFTs.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{nfts.length}</span> NFTs
          {filteredNFTs.length < nfts.length && (
            <span className="ml-1">
              (filtered from {nfts.length})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>View:</span>
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} 
                transition-colors duration-200`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} 
                transition-colors duration-200`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && filteredNFTs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No NFTs Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            We couldn&apos;t find any NFTs matching your search criteria. Try adjusting your filters or search term.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      )}
      
      {/* NFT Grid with Transitions */}
      {!isLoading && filteredNFTs.length > 0 && (
        <div 
          className={`${gridTransitionClass} ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
              : 'flex flex-col space-y-4'
          }`}
        >
          {filteredNFTs.map((nft) => (
          <div 
            key={nft.id}
              className={`${gridTransitionClass} ${
                viewMode === 'list' 
                  ? 'w-full' 
                  : 'w-full aspect-square hover:-translate-y-1 hover:shadow-lg'
            }`}
          >
            <NFTCard
              nft={nft}
                variant={viewMode === 'list' ? 'expanded' : variant}
              onOwnerClick={onOwnerClick}
                onNFTClick={onNFTClick}
                className={`h-full ${viewMode === 'list' ? 'max-w-full' : ''}`}
            />
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

// Helper function to get chain name
function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    56: 'BSC',
    43114: 'Avalanche',
    42161: 'Arbitrum',
    10: 'Optimism',
    // Add more chains as needed
  };
  return chains[chainId] || `Chain ${chainId}`;
}
