import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AlertTriangle, Shield, ShieldCheck, ShieldAlert, ExternalLink, Search, TrendingUp, Clock, Tag, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface SecurityMetric {
  name: string;
  risk: RiskLevel;
  description: string;
  impact: string;
  recommendation?: string;
}

export interface ProtocolRisk {
  address: string;
  name: string;
  tvl?: string;
  audited: boolean;
  lastAudit?: string;
  riskScore: number;
  metrics: SecurityMetric[];
}

export interface NFTListing {
  id: string;
  name: string;
  collectionName: string;
  imageUrl: string;
  marketplace: string;
  marketplaceIcon: string;
  price: number;
  priceUSD: number;
  currency: string;
  lastUpdate: string;
  link: string;
  rank?: number;
  rarity?: number;
}

interface ProtocolRiskScannerProps {
  onScan: (address: string) => Promise<void>;
}

interface NFTMarketplaceAggregatorProps {
  onSearch: (query: string) => Promise<void>;
}

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case RiskLevel.LOW:
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case RiskLevel.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case RiskLevel.HIGH:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case RiskLevel.CRITICAL:
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

const mockProtocolData: ProtocolRisk = {
  address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  name: "Example Protocol",
  tvl: "$1.5M",
  audited: true,
  lastAudit: "2024-02-15",
  riskScore: 85,
  metrics: [
    {
      name: "Access Control",
      risk: RiskLevel.LOW,
      description: "Role-based access control implemented correctly",
      impact: "Low risk of unauthorized access",
      recommendation: "Consider implementing timelock for admin functions"
    },
    {
      name: "Oracle Usage",
      risk: RiskLevel.MEDIUM,
      description: "Single price oracle dependency",
      impact: "Potential price manipulation risks",
      recommendation: "Implement multiple oracle sources"
    },
    {
      name: "External Calls",
      risk: RiskLevel.HIGH,
      description: "Unchecked external calls present",
      impact: "Vulnerable to reentrancy attacks",
      recommendation: "Implement reentrancy guards"
    }
  ]
};

// Initial display data (one of each collection)
const initialListings: NFTListing[] = [
  {
    id: "1",
    name: "Bored Ape #7834",
    collectionName: "Bored Ape Yacht Club",
    imageUrl: "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?w=500&auto=format",
    marketplace: "OpenSea",
    marketplaceIcon: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
    price: 70,
    priceUSD: 168000,
    currency: "ETH",
    lastUpdate: "2024-03-16T12:00:00Z",
    link: "https://opensea.io/collection/boredapeyachtclub",
    rank: 2435,
    rarity: 0.89
  },
  {
    id: "4",
    name: "Azuki #9839",
    collectionName: "Azuki",
    imageUrl: "https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?w=500&auto=format",
    marketplace: "Blur",
    marketplaceIcon: "https://blur.io/favicon.ico",
    price: 14.2,
    priceUSD: 34080,
    currency: "ETH",
    lastUpdate: "2024-03-16T15:45:00Z",
    link: "https://blur.io/collection/azuki",
    rank: 2156,
    rarity: 0.87
  },
  {
    id: "5",
    name: "Doodle #4875",
    collectionName: "Doodles",
    imageUrl: "https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?w=500&auto=format",
    marketplace: "OpenSea",
    marketplaceIcon: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
    price: 6.9,
    priceUSD: 16560,
    currency: "ETH",
    lastUpdate: "2024-03-16T17:10:00Z",
    link: "https://opensea.io/collection/doodles-official",
    rank: 3421,
    rarity: 0.82
  },
  {
    id: "6",
    name: "Pudgy #3156",
    collectionName: "Pudgy Penguins",
    imageUrl: "https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?w=500&auto=format",
    marketplace: "OpenSea",
    marketplaceIcon: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
    price: 9.8,
    priceUSD: 23520,
    currency: "ETH",
    lastUpdate: "2024-03-16T18:05:00Z",
    link: "https://opensea.io/collection/pudgypenguins",
    rank: 876,
    rarity: 0.94
  }
];

// Full collection data for search results
const allListings: NFTListing[] = [
  ...initialListings,
  {
    id: "2",
    name: "Bored Ape #3749",
    collectionName: "Bored Ape Yacht Club",
    imageUrl: "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?w=500&auto=format",
    marketplace: "OpenSea",
    marketplaceIcon: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
    price: 68.5,
    priceUSD: 164400,
    currency: "ETH",
    lastUpdate: "2024-03-16T14:30:00Z",
    link: "https://opensea.io/collection/boredapeyachtclub",
    rank: 1876,
    rarity: 0.92
  },
  {
    id: "3",
    name: "Bored Ape #8817",
    collectionName: "Bored Ape Yacht Club",
    imageUrl: "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?w=500&auto=format",
    marketplace: "OpenSea",
    marketplaceIcon: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
    price: 72.5,
    priceUSD: 174000,
    currency: "ETH",
    lastUpdate: "2024-03-16T13:15:00Z",
    link: "https://opensea.io/collection/boredapeyachtclub",
    rank: 1234,
    rarity: 0.95
  },
  {
    id: "7",
    name: "Azuki #5621",
    collectionName: "Azuki",
    imageUrl: "https://i.seadn.io/gcs/files/c5aaa0fc8a2c9f16ccde3d7fa1b8a134.png?w=500&auto=format",
    marketplace: "Blur",
    marketplaceIcon: "https://blur.io/favicon.ico",
    price: 12.8,
    priceUSD: 30720,
    currency: "ETH",
    lastUpdate: "2024-03-16T19:30:00Z",
    link: "https://blur.io/collection/azuki",
    rank: 1245,
    rarity: 0.92
  },
  {
    id: "8",
    name: "Doodle #2241",
    collectionName: "Doodles",
    imageUrl: "https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?w=500&auto=format",
    marketplace: "OpenSea",
    marketplaceIcon: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
    price: 7.2,
    priceUSD: 17280,
    currency: "ETH",
    lastUpdate: "2024-03-16T20:00:00Z",
    link: "https://opensea.io/collection/doodles-official",
    rank: 2876,
    rarity: 0.85
  },
  {
    id: "9",
    name: "Pudgy #4492",
    collectionName: "Pudgy Penguins",
    imageUrl: "https://i.seadn.io/gae/yNi-XdGxsgQCPpqSio4o31ygAV6wURdIdInWRcFIl46UjUQ1eV7BEndGe8L661OoG-clRi7EgInLX4LPu9Jfw4fq0bnVYHqg7RFi?w=500&auto=format",
    marketplace: "OpenSea",
    marketplaceIcon: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
    price: 10.2,
    priceUSD: 24480,
    currency: "ETH",
    lastUpdate: "2024-03-16T20:30:00Z",
    link: "https://opensea.io/collection/pudgypenguins",
    rank: 1543,
    rarity: 0.88
  }
];

export function ProtocolRiskScanner({ onScan }: ProtocolRiskScannerProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProtocolRisk | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const handleScan = useCallback(async () => {
    setLoading(true);
    try {
      await onScan(address);
      // For demo purposes, we'll set mock data
      setData(mockProtocolData);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setLoading(false);
    }
  }, [address, onScan]);

  const getRiskIcon = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.LOW:
        return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case RiskLevel.MEDIUM:
        return <Shield className="w-5 h-5 text-yellow-500" />;
      case RiskLevel.HIGH:
        return <ShieldAlert className="w-5 h-5 text-orange-500" />;
      case RiskLevel.CRITICAL:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter contract address"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
        />
        <button
          onClick={handleScan}
          disabled={loading || !address}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                   dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {loading ? 'Scanning...' : 'Scan Protocol'}
        </button>
      </div>

      {data && (
        <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          {/* Protocol Overview */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{data.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{data.address}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">TVL: {data.tvl}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {data.audited ? `Last Audit: ${data.lastAudit}` : 'Not Audited'}
                </div>
              </div>
            </div>

            {/* Risk Score */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Score</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.riskScore}/100</div>
              </div>
              <div className="h-16 w-16 relative">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    className="dark:stroke-gray-700"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeDasharray={`${data.riskScore}, 100`}
                    className="dark:stroke-blue-500"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Security Metrics */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Security Analysis</h4>
            <div className="space-y-3">
              {data.metrics.map((metric) => (
                <div
                  key={metric.name}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedMetric(expandedMetric === metric.name ? null : metric.name)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 
                             dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getRiskIcon(metric.risk)}
                      <span className="font-medium text-gray-900 dark:text-white">{metric.name}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(metric.risk)}`}>
                      {metric.risk}
                    </span>
                  </button>
                  
                  {expandedMetric === metric.name && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <dl className="space-y-3 text-sm">
                        <div>
                          <dt className="text-gray-500 dark:text-gray-400">Description</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{metric.description}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500 dark:text-gray-400">Impact</dt>
                          <dd className="mt-1 text-gray-900 dark:text-white">{metric.impact}</dd>
                        </div>
                        {metric.recommendation && (
                          <div>
                            <dt className="text-gray-500 dark:text-gray-400">Recommendation</dt>
                            <dd className="mt-1 text-gray-900 dark:text-white">{metric.recommendation}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function NFTMarketplaceAggregator({ onSearch }: NFTMarketplaceAggregatorProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<NFTListing[]>(initialListings);
  const [sortBy, setSortBy] = useState<'price' | 'lastUpdate' | 'rarity'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);

  // Update the useEffect for search
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query) {
        setLoading(true);
        try {
          await onSearch(query);
          // Search through all listings when query exists
          const searchResults = allListings.filter(listing => {
            const searchTerm = query.toLowerCase();
            return (
              listing.name.toLowerCase().includes(searchTerm) ||
              listing.collectionName.toLowerCase().includes(searchTerm) ||
              listing.id.toLowerCase().includes(searchTerm)
            );
          });
          setListings(searchResults);
        } catch (error) {
          console.error('Search failed:', error);
          setListings([]);
        } finally {
          setLoading(false);
        }
      } else {
        setListings(initialListings); // Reset to initial listings when query is empty
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, onSearch]);

  // Remove the handleSearch function since we're using the useEffect hook for real-time search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const marketplaces = useMemo(() => 
    Array.from(new Set(allListings.map(listing => listing.marketplace))),
    []
  );

  const filteredListings = useMemo(() => {
    let filtered = [...listings];
    
    // Apply price range filter
    if (priceRange.min) {
      filtered = filtered.filter(item => item.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(item => item.price <= Number(priceRange.max));
    }

    // Apply marketplace filter
    if (selectedMarketplaces.length > 0) {
      filtered = filtered.filter(item => selectedMarketplaces.includes(item.marketplace));
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'rarity' && a.rarity && b.rarity) {
        return sortOrder === 'asc' ? a.rarity - b.rarity : b.rarity - a.rarity;
      } else {
        return sortOrder === 'asc' 
          ? new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()
          : new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      }
    });
  }, [listings, sortBy, sortOrder, priceRange, selectedMarketplaces]);

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  };

  const formatUSD = (price: number) => {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleMarketplace = (marketplace: string) => {
    setSelectedMarketplaces(prev => 
      prev.includes(marketplace)
        ? prev.filter(m => m !== marketplace)
        : [...prev, marketplace]
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search NFTs by name, collection, or token ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700
                         text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                         rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none 
                         focus:ring-2 focus:ring-gray-500 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Price Range (ETH)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-[200px] space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Marketplaces
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {marketplaces.map(marketplace => (
                      <button
                        key={marketplace}
                        type="button"
                        onClick={() => toggleMarketplace(marketplace)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedMarketplaces.includes(marketplace)
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {marketplace}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(selectedMarketplaces.length > 0 || priceRange.min || priceRange.max) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMarketplaces([]);
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-700 
                           dark:hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {filteredListings.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
            <div className="flex space-x-2">
              {[
                { key: 'price' as const, icon: Tag, label: 'Price' },
                { key: 'lastUpdate' as const, icon: Clock, label: 'Last Update' },
                { key: 'rarity' as const, icon: TrendingUp, label: 'Rarity' }
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    if (sortBy === key) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy(key);
                      setSortOrder('asc');
                    }
                  }}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    sortBy === key 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {sortBy === key && (
                    sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredListings.length} results
          </div>
        </div>
      )}

      {filteredListings.length > 0 ? (
        <div className="grid gap-6">
          {filteredListings.map((listing) => (
            <div
              key={`${listing.id}-${listing.marketplace}`}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 
                       dark:border-gray-700 transition-all duration-200 hover:shadow-md`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover transform transition-transform duration-300 
                               hover:scale-110"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {listing.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {listing.collectionName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 
                                    px-3 py-1 rounded-full">
                        <Image
                          src={listing.marketplaceIcon}
                          alt={listing.marketplace}
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {listing.marketplace}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatPrice(listing.price, listing.currency)}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {formatUSD(listing.priceUSD)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Update</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(listing.lastUpdate)}
                        </p>
                      </div>
                      {(listing.rank || listing.rarity) && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {listing.rank ? 'Rank' : 'Rarity'}
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {listing.rank ? `#${listing.rank}` : `${(listing.rarity! * 100).toFixed(2)}%`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <a
                        href={listing.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                                 hover:bg-blue-700 transition-colors"
                      >
                        <span>View on {listing.marketplace}</span>
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : query && !loading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border 
                     border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No listings found for &quot;{query}&quot;
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
