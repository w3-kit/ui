import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Token } from '../token-list/types';
import { formatBalance, formatCurrency } from '../token-list/utils';
import { 
  TrendingUp, TrendingDown, ArrowRight, Wallet, DollarSign, 
  Star, StarOff, Share2, Info, BarChart2, Clock, ChevronDown, ChevronUp,
  MoreVertical, Copy, Check, Zap
} from 'lucide-react';

// Extend the Token interface with additional properties we need
interface ExtendedToken extends Token {
  priceChange24h?: number;
  verified?: boolean;
  marketCap?: number;
  volume24h?: number;
  allTimeHigh?: number;
  allTimeHighDate?: string;
  rank?: number;
}

interface TokenCardProps {
  token: ExtendedToken;
  variant?: 'default' | 'compact' | 'expanded' | 'minimal';
  onClick?: (token: ExtendedToken) => void;
  showBalance?: boolean;
  showPrice?: boolean;
  showPriceChange?: boolean;
  onFavoriteToggle?: (token: ExtendedToken, isFavorite: boolean) => void;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  variant = 'default',
  onClick,
  showBalance = true,
  showPrice = true,
  showPriceChange = false,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset copy success state after 2 seconds
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to render price change indicator
  const renderPriceChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        <span>{isPositive ? '+' : ''}{change.toFixed(2)}%</span>
      </div>
    );
  };


  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavoriteToggle?.(token, newState);
  };

  // Handle share click
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${token.name} (${token.symbol})`,
        text: `Check out ${token.name} (${token.symbol}) - Current price: ${token.price ? formatCurrency(token.price) : 'N/A'}`,
        url: `https://example.com/tokens/${token.symbol.toLowerCase()}`
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${token.name} (${token.symbol}) - Current price: ${token.price ? formatCurrency(token.price) : 'N/A'}`);
      setCopySuccess(true);
    }
  };

  // Toggle details view
  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  // Toggle dropdown menu
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Copy token information to clipboard
  const copyTokenInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${token.name} (${token.symbol}) - ${token.price ? formatCurrency(token.price) : 'N/A'}`);
    setCopySuccess(true);
    setTimeout(() => {
      setShowDropdown(false);
    }, 1500);
  };

  // Ensure logoURI is a valid string for Next.js Image component
  const logoURI = token.logoURI || '/placeholder-token.png'; // Fallback image

  const variants = {
    default: (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 cursor-pointer
          border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 relative overflow-hidden"
        onClick={() => onClick?.(token)}
      >
        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-5 dark:opacity-10">
          <div className="w-full h-full bg-contain bg-no-repeat bg-right-top" 
               style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50 L100 0 L100 100 Z' fill='%23${token.symbol.charCodeAt(0).toString(16).padStart(2, '0')}${token.symbol.charCodeAt(1)?.toString(16).padStart(2, '0') || '00'}${token.symbol.charCodeAt(2)?.toString(16).padStart(2, '0') || '00'}' /%3E%3C/svg%3E")`}}></div>
        </div>
        
        {/* Token rank badge (if available) */}
        {token.rank && (
          <div className="absolute top-3 right-3 bg-gray-100 dark:bg-gray-700 text-xs font-medium px-1.5 py-0.5 rounded-md flex items-center">
            <Zap className="w-3 h-3 mr-1 text-yellow-500" />
            #{token.rank}
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm">
              <Image 
                src={logoURI} 
                alt={token.symbol}
                fill
                className="object-cover"
              />
            </div>
            {showPriceChange && token.priceChange24h !== undefined && (
              <div className="absolute -bottom-1 -right-1">
                <div className={`flex items-center justify-center w-5 h-5 rounded-full shadow-sm ${token.priceChange24h >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {token.priceChange24h >= 0 ? (
                    <TrendingUp className={`w-3 h-3 text-green-500`} />
                  ) : (
                    <TrendingDown className={`w-3 h-3 text-red-500`} />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">{token.name}</h3>
              <div className="flex items-center space-x-1 relative">
                <button 
                  onClick={handleFavoriteToggle}
                  className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? <Star className="w-3.5 h-3.5" /> : <StarOff className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onClick={handleShare}
                  className="p-1.5 text-gray-400 hover:text-gray-500 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Share token"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={toggleDropdown}
                  className="p-1.5 text-gray-400 hover:text-gray-500 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="More options"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div 
                    ref={dropdownRef}
                    className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{token.name} ({token.symbol})</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {token.price ? formatCurrency(token.price) : 'Price N/A'}
                      </p>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={handleFavoriteToggle}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        {isFavorite ? (
                          <>
                            <StarOff className="w-3.5 h-3.5 mr-2 text-gray-500" />
                            Remove from favorites
                          </>
                        ) : (
                          <>
                            <Star className="w-3.5 h-3.5 mr-2 text-yellow-500" />
                            Add to favorites
                          </>
                        )}
                      </button>
                      <button 
                        onClick={handleShare}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <Share2 className="w-3.5 h-3.5 mr-2 text-gray-500" />
                        Share token
                      </button>
                      <button 
                        onClick={copyTokenInfo}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${copySuccess ? 'text-green-500' : ''}`}
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-2 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-2 text-gray-500" />
                            Copy info
                          </>
                        )}
                      </button>
                    </div>
                    {(token.marketCap || token.volume24h || token.allTimeHigh) && (
                      <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2">
                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1.5">Quick Stats</p>
                        {token.marketCap && (
                          <div className="flex justify-between items-center mb-1.5">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {formatCurrency(token.marketCap)}
                            </p>
                          </div>
                        )}
                        {token.volume24h && (
                          <div className="flex justify-between items-center mb-1.5">
                            <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {formatCurrency(token.volume24h)}
                            </p>
                          </div>
                        )}
                        {token.allTimeHigh && (
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">All-Time High</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {formatCurrency(token.allTimeHigh)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {token.symbol}
              {token.verified && (
                <span className="ml-1 inline-flex items-center justify-center w-3.5 h-3.5 bg-blue-500 rounded-full">
                  <Check className="w-2 h-2 text-white" />
                </span>
              )}
            </p>
          </div>
        </div>
        
        {/* Price section with visual indicator */}
        {showPrice && token.price && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Price</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(token.price)}
              </p>
            </div>
            {showPriceChange && token.priceChange24h !== undefined && (
              <div className="mt-2 w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">24h Change</span>
                  <span className={`text-xs font-medium ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${token.priceChange24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(token.priceChange24h * 2), 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {(showBalance || showPrice) && (
          <div className="mt-3 space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            {showBalance && token.balance && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Wallet className="w-3.5 h-3.5 mr-1.5" />
                  Balance
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {formatBalance(token.balance, token.decimals)} {token.symbol}
                </p>
              </div>
            )}
            {showPrice && token.price && token.balance && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                  Value
                </p>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Number(token.balance) * token.price)}
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-3 flex justify-between items-center">
          <button 
            onClick={toggleDetails} 
            className="text-blue-500 dark:text-blue-400 text-xs flex items-center hover:underline transition-colors px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            {showDetails ? (
              <>Less <ChevronUp className="w-3 h-3 ml-1" /></>
            ) : (
              <>More <ChevronDown className="w-3 h-3 ml-1" /></>
            )}
          </button>
          <div 
            className="text-blue-500 dark:text-blue-400 text-xs flex items-center px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(token);
            }}
          >
            Details <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
        
        {/* Expandable details section */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {token.marketCap && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
                  Market Cap
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {formatCurrency(token.marketCap)}
                </p>
              </div>
            )}
            {token.volume24h && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
                  24h Volume
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {formatCurrency(token.volume24h)}
                </p>
              </div>
            )}
            {token.allTimeHigh && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                  All-Time High
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {formatCurrency(token.allTimeHigh)}
                </p>
              </div>
            )}
            {token.allTimeHighDate && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  ATH Date
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {formatDate(token.allTimeHighDate)}
                </p>
              </div>
            )}
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="w-3.5 h-3.5 mr-1.5" />
                Chain ID
              </p>
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {token.chainId}
              </p>
            </div>
          </div>
        )}
      </div>
    ),

    compact: (
      <div 
        className="flex items-center justify-between bg-white dark:bg-gray-800 px-3 py-2 
          hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700
          transition-all duration-200 hover:pl-4"
        onClick={() => onClick?.(token)}
      >
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <Image 
              src={logoURI} 
              alt={token.symbol}
              width={30}
              height={30}
              className="rounded-full"
            />
            {showPriceChange && token.priceChange24h !== undefined && (
              <div className="absolute -bottom-1 -right-1">
                <div className={`flex items-center justify-center w-3.5 h-3.5 rounded-full ${token.priceChange24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                  {token.priceChange24h >= 0 ? (
                    <TrendingUp className="w-2 h-2 text-white" />
                  ) : (
                    <TrendingDown className="w-2 h-2 text-white" />
                  )}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-white text-sm">{token.symbol}</span>
              {token.verified && (
                <span className="ml-1 inline-flex items-center justify-center w-3 h-3 bg-blue-500 rounded-full">
                  <span className="text-white text-[8px]">✓</span>
                </span>
              )}
              {token.rank && (
                <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">#{token.rank}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {showPrice && token.price && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(token.price)}
                </p>
              )}
              {showPriceChange && token.priceChange24h !== undefined && (
                <span className={`text-xs ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {showBalance && token.balance && (
            <div className="text-right">
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {formatBalance(token.balance, token.decimals)}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {token.price && token.balance
                  ? formatCurrency(Number(token.balance) * token.price)
                  : ''}
              </p>
            </div>
          )}
          <div className="flex space-x-1 relative">
            <button 
              onClick={handleFavoriteToggle}
              className={`p-1 rounded-full transition-colors ${isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'}`}
            >
              {isFavorite ? <Star className="w-3.5 h-3.5" /> : <StarOff className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={handleShare}
              className="p-1 text-gray-400 hover:text-gray-500 rounded-full transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={toggleDropdown}
              className="p-1 text-gray-400 hover:text-gray-500 rounded-full transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div 
                ref={dropdownRef}
                className="absolute top-full right-0 mt-1 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{token.name} ({token.symbol})</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {token.price ? formatCurrency(token.price) : 'Price N/A'}
                  </p>
                </div>
                <div className="py-1">
                  <button 
                    onClick={handleFavoriteToggle}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    {isFavorite ? (
                      <>
                        <StarOff className="w-3.5 h-3.5 mr-2 text-gray-500" />
                        Remove from favorites
                      </>
                    ) : (
                      <>
                        <Star className="w-3.5 h-3.5 mr-2 text-yellow-500" />
                        Add to favorites
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-2 text-gray-500" />
                    Share token
                  </button>
                  <button 
                    onClick={copyTokenInfo}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${copySuccess ? 'text-green-500' : ''}`}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-2 text-gray-500" />
                        Copy info
                      </>
                    )}
                  </button>
                </div>
                {(token.marketCap || token.volume24h || token.allTimeHigh) && (
                  <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2">
                    <p className="text-xs font-medium text-gray-900 dark:text-white mb-1.5">Quick Stats</p>
                    {token.marketCap && (
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {formatCurrency(token.marketCap)}
                        </p>
                      </div>
                    )}
                    {token.volume24h && (
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {formatCurrency(token.volume24h)}
                        </p>
                      </div>
                    )}
                    {token.allTimeHigh && (
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">All-Time High</p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {formatCurrency(token.allTimeHigh)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    expanded: (
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer
          border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 relative"
        onClick={() => onClick?.(token)}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 dark:to-gray-800 rounded-xl opacity-50"></div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image 
                  src={logoURI} 
                  alt={token.symbol}
                  width={30}
                  height={30}
                  className="rounded-full shadow-md"
                />
                {showPriceChange && token.priceChange24h !== undefined && (
                  <div className="absolute -bottom-1 -right-1">
                    <div className={`flex items-center justify-center w-4 h-4 rounded-full ${token.priceChange24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                      {token.priceChange24h >= 0 ? (
                        <TrendingUp className="w-2.5 h-2.5 text-white" />
                      ) : (
                        <TrendingDown className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                  {token.name}
                  {token.verified && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 bg-blue-500 rounded-full">
                      <span className="text-white text-[8px]">✓</span>
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{token.symbol}</p>
              </div>
            </div>
            <div className="text-right flex items-center space-x-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chain ID</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{token.chainId}</p>
              </div>
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="p-1.5 text-gray-400 hover:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div 
                    ref={dropdownRef}
                    className="absolute top-full right-0 mt-1 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{token.name} ({token.symbol})</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {token.price ? formatCurrency(token.price) : 'Price N/A'}
                      </p>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={handleFavoriteToggle}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        {isFavorite ? (
                          <>
                            <StarOff className="w-3.5 h-3.5 mr-2 text-gray-500" />
                            Remove from favorites
                          </>
                        ) : (
                          <>
                            <Star className="w-3.5 h-3.5 mr-2 text-yellow-500" />
                            Add to favorites
                          </>
                        )}
                      </button>
                      <button 
                        onClick={handleShare}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <Share2 className="w-3.5 h-3.5 mr-2 text-gray-500" />
                        Share token
                      </button>
                      <button 
                        onClick={copyTokenInfo}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${copySuccess ? 'text-green-500' : ''}`}
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-2 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-2 text-gray-500" />
                            Copy info
                          </>
                        )}
                      </button>
                    </div>
                    {(token.marketCap || token.volume24h || token.allTimeHigh) && (
                      <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2">
                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1.5">Quick Stats</p>
                        {token.marketCap && (
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {formatCurrency(token.marketCap)}
                            </p>
                          </div>
                        )}
                        {token.volume24h && (
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {formatCurrency(token.volume24h)}
                            </p>
                          </div>
                        )}
                        {token.allTimeHigh && (
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">All-Time High</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {formatCurrency(token.allTimeHigh)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {(showBalance || showPrice) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              {showBalance && token.balance && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Wallet className="w-3.5 h-3.5 mr-1.5" />
                    Balance
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {formatBalance(token.balance, token.decimals)} {token.symbol}
                  </p>
                </div>
              )}
              {showPrice && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                      Price
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {token.price ? formatCurrency(token.price) : '-'}
                      </p>
                      {showPriceChange && token.priceChange24h !== undefined && (
                        <span className="ml-2">
                          {renderPriceChange(token.priceChange24h)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2 bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Value</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {token.price && token.balance
                        ? formatCurrency(Number(token.balance) * token.price)
                        : '-'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="mt-3 flex justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={handleFavoriteToggle}
                className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-400 hover:text-gray-500 bg-gray-100 dark:bg-gray-700'}`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
              </button>
              <button 
                onClick={handleShare}
                className="p-1.5 text-gray-400 hover:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors"
                title="Share token"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={toggleDetails}
              className="text-blue-500 dark:text-blue-400 text-xs flex items-center hover:underline"
            >
              {showDetails ? (
                <>Less info <ChevronUp className="w-3 h-3 ml-1" /></>
              ) : (
                <>More info <ChevronDown className="w-3 h-3 ml-1" /></>
              )}
            </button>
          </div>
          
          {/* Expandable details section */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2 animate-[fadeIn_0.2s_ease-in-out]">
              {token.marketCap && (
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <BarChart2 className="w-3 h-3 mr-1" />
                    Market Cap
                  </p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatCurrency(token.marketCap)}
                  </p>
                </div>
              )}
              {token.volume24h && (
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <BarChart2 className="w-3 h-3 mr-1" />
                    24h Volume
                  </p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatCurrency(token.volume24h)}
                  </p>
                </div>
              )}
              {token.allTimeHigh && (
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    All-Time High
                  </p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatCurrency(token.allTimeHigh)}
                  </p>
                </div>
              )}
              {token.allTimeHighDate && (
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    ATH Date
                  </p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatDate(token.allTimeHighDate)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ),

    minimal: (
      <div 
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full 
          bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer
          transition-all duration-200 hover:shadow-sm"
        onClick={() => onClick?.(token)}
      >
        <div className="relative">
          <Image 
            src={logoURI} 
            alt={token.symbol}
            width={18}
            height={18}
            className="rounded-full"
          />
          {showPriceChange && token.priceChange24h !== undefined && token.priceChange24h < 0 && (
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
          )}
          {showPriceChange && token.priceChange24h !== undefined && token.priceChange24h >= 0 && (
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          )}
        </div>
        <span className="text-xs font-medium text-gray-900 dark:text-white">{token.symbol}</span>
        {showPrice && token.price && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatCurrency(token.price)}
          </span>
        )}
        {showPriceChange && token.priceChange24h !== undefined && (
          <span className={`text-xs ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
          </span>
        )}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown(e);
            }}
            className="p-0.5 rounded-full transition-colors text-gray-400 hover:text-gray-500"
          >
            <MoreVertical className="w-3 h-3" />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div 
              ref={dropdownRef}
              className="absolute top-full right-0 mt-1 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-900 dark:text-white">{token.name} ({token.symbol})</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {token.price ? formatCurrency(token.price) : 'Price N/A'}
                </p>
              </div>
              <div className="py-1">
                <button 
                  onClick={handleFavoriteToggle}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  {isFavorite ? (
                    <>
                      <StarOff className="w-3.5 h-3.5 mr-2 text-gray-500" />
                      Remove from favorites
                    </>
                  ) : (
                    <>
                      <Star className="w-3.5 h-3.5 mr-2 text-yellow-500" />
                      Add to favorites
                    </>
                  )}
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <Share2 className="w-3.5 h-3.5 mr-2 text-gray-500" />
                  Share token
                </button>
                <button 
                  onClick={copyTokenInfo}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${copySuccess ? 'text-green-500' : ''}`}
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-2 text-gray-500" />
                      Copy info
                    </>
                  )}
                </button>
              </div>
              {(token.marketCap || token.volume24h || token.allTimeHigh) && (
                <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2">
                  <p className="text-xs font-medium text-gray-900 dark:text-white mb-1.5">Quick Stats</p>
                  {token.marketCap && (
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {formatCurrency(token.marketCap)}
                      </p>
                    </div>
                  )}
                  {token.volume24h && (
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {formatCurrency(token.volume24h)}
                      </p>
                    </div>
                  )}
                  {token.allTimeHigh && (
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">All-Time High</p>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {formatCurrency(token.allTimeHigh)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ),
  };

  return variants[variant];
}; 