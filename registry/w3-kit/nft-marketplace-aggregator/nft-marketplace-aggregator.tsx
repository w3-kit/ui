"use client";

import React, { useState, useMemo } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Grid,
  List,
  ExternalLink,
  Heart,
  Clock,
  TrendingUp,
  Sparkles,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  RiskLevel,
  ProtocolRisk,
  NFTListing,
  ProtocolRiskScannerProps,
  NFTMarketplaceAggregatorProps,
} from "./types";
import {
  getRiskColor,
  getRiskBgColor,
  formatPrice,
  formatUSD,
  formatDate,
} from "./utils";

const mockProtocolData: ProtocolRisk[] = [
  {
    protocol: "OpenSea",
    overallScore: 92,
    riskLevel: RiskLevel.LOW,
    metrics: [
      {
        name: "Smart Contract Security",
        score: 95,
        maxScore: 100,
        description: "Audited by multiple firms",
      },
      {
        name: "Liquidity Risk",
        score: 88,
        maxScore: 100,
        description: "High trading volume",
      },
      {
        name: "Centralization",
        score: 75,
        maxScore: 100,
        description: "Semi-centralized operations",
      },
      {
        name: "Track Record",
        score: 98,
        maxScore: 100,
        description: "5+ years operation",
      },
    ],
    lastAudit: "2024-01-15",
    auditor: "Trail of Bits",
  },
  {
    protocol: "Blur",
    overallScore: 78,
    riskLevel: RiskLevel.MEDIUM,
    metrics: [
      {
        name: "Smart Contract Security",
        score: 82,
        maxScore: 100,
        description: "Single audit completed",
      },
      {
        name: "Liquidity Risk",
        score: 90,
        maxScore: 100,
        description: "Very high volume",
      },
      {
        name: "Centralization",
        score: 65,
        maxScore: 100,
        description: "Centralized matching",
      },
      {
        name: "Track Record",
        score: 70,
        maxScore: 100,
        description: "2 years operation",
      },
    ],
    lastAudit: "2023-11-20",
    auditor: "OpenZeppelin",
  },
  {
    protocol: "LooksRare",
    overallScore: 85,
    riskLevel: RiskLevel.LOW,
    metrics: [
      {
        name: "Smart Contract Security",
        score: 88,
        maxScore: 100,
        description: "Multiple audits",
      },
      {
        name: "Liquidity Risk",
        score: 75,
        maxScore: 100,
        description: "Moderate volume",
      },
      {
        name: "Centralization",
        score: 82,
        maxScore: 100,
        description: "Decentralized governance",
      },
      {
        name: "Track Record",
        score: 85,
        maxScore: 100,
        description: "3 years operation",
      },
    ],
    lastAudit: "2024-02-01",
    auditor: "Certik",
  },
];

export function ProtocolRiskScanner({
  protocols = mockProtocolData,
  className = "",
}: ProtocolRiskScannerProps) {
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case RiskLevel.MEDIUM:
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case RiskLevel.HIGH:
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case RiskLevel.CRITICAL:
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div
      className={`bg-gray-900 rounded-2xl border border-gray-800 p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Shield className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Protocol Risk Scanner</h2>
          <p className="text-sm text-gray-400">
            Security analysis of NFT marketplaces
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {protocols.map((protocol) => (
          <div
            key={protocol.protocol}
            className="bg-gray-800/50 rounded-xl overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedProtocol(
                  expandedProtocol === protocol.protocol
                    ? null
                    : protocol.protocol
                )
              }
              className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {protocol.protocol.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">
                    {protocol.protocol}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Last audit: {protocol.lastAudit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(protocol.riskLevel)}
                    <span
                      className={`font-semibold ${getRiskColor(protocol.riskLevel)}`}
                    >
                      {protocol.overallScore}/100
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getRiskBgColor(protocol.riskLevel)} ${getRiskColor(protocol.riskLevel)}`}
                  >
                    {protocol.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                {expandedProtocol === protocol.protocol ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedProtocol === protocol.protocol && (
              <div className="p-4 pt-0 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {protocol.metrics.map((metric) => (
                    <div key={metric.name} className="bg-gray-900/50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">
                          {metric.name}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {metric.score}/{metric.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metric.score >= 80
                              ? "bg-green-400"
                              : metric.score >= 60
                                ? "bg-yellow-400"
                                : "bg-red-400"
                          }`}
                          style={{
                            width: `${(metric.score / metric.maxScore) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {metric.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Audited by:{" "}
                    <span className="text-white font-medium">
                      {protocol.auditor}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const initialListings: NFTListing[] = [
  {
    id: "1",
    name: "Bored Ape #7842",
    image: "https://placehold.co/400x400/1a1a2e/ffffff?text=BAYC",
    collection: "Bored Ape Yacht Club",
    marketplace: "OpenSea",
    marketplaceLogo: "https://placehold.co/32x32/2081e2/ffffff?text=OS",
    price: 32.5,
    currency: "ETH",
    usdPrice: 97500,
    lastSale: 28.2,
    rarity: 1247,
    traits: [
      { trait: "Background", value: "Blue", rarity: 12.5 },
      { trait: "Fur", value: "Golden", rarity: 0.5 },
      { trait: "Eyes", value: "Laser", rarity: 2.1 },
    ],
    verified: true,
    endTime: "2024-03-15T14:00:00Z",
  },
  {
    id: "2",
    name: "Azuki #4521",
    image: "https://placehold.co/400x400/c4314b/ffffff?text=Azuki",
    collection: "Azuki",
    marketplace: "Blur",
    marketplaceLogo: "https://placehold.co/32x32/ff6b35/ffffff?text=B",
    price: 8.9,
    currency: "ETH",
    usdPrice: 26700,
    lastSale: 9.2,
    rarity: 3421,
    traits: [
      { trait: "Type", value: "Human", rarity: 45.2 },
      { trait: "Hair", value: "Pink Long", rarity: 3.2 },
      { trait: "Clothing", value: "Kimono", rarity: 5.1 },
    ],
    verified: true,
  },
  {
    id: "3",
    name: "Pudgy Penguin #6234",
    image: "https://placehold.co/400x400/87ceeb/000000?text=Pudgy",
    collection: "Pudgy Penguins",
    marketplace: "LooksRare",
    marketplaceLogo: "https://placehold.co/32x32/0ce466/ffffff?text=LR",
    price: 4.2,
    currency: "ETH",
    usdPrice: 12600,
    lastSale: 3.8,
    rarity: 5621,
    traits: [
      { trait: "Background", value: "Purple", rarity: 8.3 },
      { trait: "Skin", value: "Gold", rarity: 1.2 },
      { trait: "Head", value: "Crown", rarity: 0.8 },
    ],
    verified: true,
    endTime: "2024-03-14T18:30:00Z",
  },
];

const allListings: NFTListing[] = [
  ...initialListings,
  {
    id: "4",
    name: "Doodle #8923",
    image: "https://placehold.co/400x400/ffd93d/000000?text=Doodle",
    collection: "Doodles",
    marketplace: "OpenSea",
    marketplaceLogo: "https://placehold.co/32x32/2081e2/ffffff?text=OS",
    price: 2.8,
    currency: "ETH",
    usdPrice: 8400,
    lastSale: 3.1,
    rarity: 7234,
    traits: [
      { trait: "Face", value: "Happy", rarity: 15.2 },
      { trait: "Hair", value: "Rainbow", rarity: 2.1 },
      { trait: "Body", value: "Gradient", rarity: 4.5 },
    ],
    verified: true,
  },
  {
    id: "5",
    name: "Clone X #12847",
    image: "https://placehold.co/400x400/6c5ce7/ffffff?text=CloneX",
    collection: "Clone X",
    marketplace: "Blur",
    marketplaceLogo: "https://placehold.co/32x32/ff6b35/ffffff?text=B",
    price: 3.5,
    currency: "ETH",
    usdPrice: 10500,
    lastSale: 4.0,
    rarity: 4892,
    traits: [
      { trait: "DNA", value: "Angel", rarity: 5.5 },
      { trait: "Eye", value: "Cyber", rarity: 3.2 },
      { trait: "Helmet", value: "None", rarity: 25.1 },
    ],
    verified: true,
  },
  {
    id: "6",
    name: "Moonbird #5678",
    image: "https://placehold.co/400x400/2d3436/ffffff?text=Moon",
    collection: "Moonbirds",
    marketplace: "OpenSea",
    marketplaceLogo: "https://placehold.co/32x32/2081e2/ffffff?text=OS",
    price: 1.9,
    currency: "ETH",
    usdPrice: 5700,
    lastSale: 2.2,
    rarity: 6543,
    traits: [
      { trait: "Feathers", value: "Cosmic", rarity: 2.8 },
      { trait: "Eyes", value: "Stare", rarity: 12.4 },
      { trait: "Beak", value: "Short", rarity: 35.2 },
    ],
    verified: true,
    endTime: "2024-03-16T09:00:00Z",
  },
];

export function NFTMarketplaceAggregator({
  initialListings: propListings = initialListings,
  onBuy,
  className = "",
}: NFTMarketplaceAggregatorProps) {
  const [listings, setListings] = useState<NFTListing[]>(propListings);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "rarity" | "recent">("price");
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedNFT, setSelectedNFT] = useState<NFTListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const marketplaces = useMemo(() => {
    const unique = [...new Set(allListings.map((l) => l.marketplace))];
    return ["all", ...unique];
  }, []);

  const filteredListings = useMemo(() => {
    let filtered = listings.filter(
      (listing) =>
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.collection.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedMarketplace !== "all") {
      filtered = filtered.filter(
        (l) => l.marketplace === selectedMarketplace
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "rarity":
          return a.rarity - b.rarity;
        default:
          return 0;
      }
    });
  }, [listings, searchQuery, sortBy, selectedMarketplace]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  };

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setListings(allListings);
      setIsLoading(false);
    }, 1000);
  };

  const handleBuy = (listing: NFTListing) => {
    if (onBuy) {
      onBuy(listing);
    } else {
      alert(`Purchasing ${listing.name} for ${listing.price} ${listing.currency}`);
    }
    setSelectedNFT(null);
  };

  return (
    <div
      className={`bg-gray-900 rounded-2xl border border-gray-800 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              NFT Marketplace Aggregator
            </h2>
            <p className="text-sm text-gray-400">
              Best prices across all marketplaces
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-purple-500/20 text-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-purple-500/20 text-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search NFTs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedMarketplace}
            onChange={(e) => setSelectedMarketplace(e.target.value)}
            className="pl-9 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:border-purple-500"
          >
            {marketplaces.map((m) => (
              <option key={m} value={m}>
                {m === "all" ? "All Marketplaces" : m}
              </option>
            ))}
          </select>
        </div>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "price" | "rarity" | "recent")
          }
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:border-purple-500"
        >
          <option value="price">Price: Low to High</option>
          <option value="rarity">Rarity: Rare First</option>
          <option value="recent">Recently Listed</option>
        </select>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        }
      >
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            onClick={() => setSelectedNFT(listing)}
            className={`bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800 transition-all cursor-pointer group ${
              viewMode === "list" ? "flex items-center p-3" : ""
            }`}
          >
            <div
              className={`relative ${viewMode === "list" ? "w-16 h-16 flex-shrink-0" : "aspect-square"}`}
            >
              <img
                src={listing.image}
                alt={listing.name}
                className={`object-cover ${viewMode === "list" ? "w-16 h-16 rounded-lg" : "w-full h-full"}`}
              />
              {listing.verified && (
                <div className="absolute top-2 left-2 p-1 bg-blue-500 rounded-full">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(listing.id);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
                  favorites.has(listing.id)
                    ? "bg-red-500 text-white"
                    : "bg-black/50 text-gray-300 opacity-0 group-hover:opacity-100"
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  fill={favorites.has(listing.id) ? "currentColor" : "none"}
                />
              </button>
              {listing.endTime && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-full text-xs text-white">
                  <Clock className="w-3 h-3" />
                  {formatDate(listing.endTime)}
                </div>
              )}
            </div>
            <div className={viewMode === "list" ? "flex-1 ml-4" : "p-4"}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">
                  {listing.collection}
                </span>
                <div className="flex items-center gap-1">
                  <img
                    src={listing.marketplaceLogo}
                    alt={listing.marketplace}
                    className="w-4 h-4 rounded-full"
                  />
                </div>
              </div>
              <h3 className="font-semibold text-white truncate">
                {listing.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-lg font-bold text-white">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatUSD(listing.usdPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs">
                    {listing.price < listing.lastSale ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
                    )}
                    <span
                      className={
                        listing.price < listing.lastSale
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {(
                        ((listing.price - listing.lastSale) / listing.lastSale) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Rank #{listing.rarity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {listings.length < allListings.length && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Load More NFTs"}
        </button>
      )}

      {selectedNFT && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedNFT.image}
                alt={selectedNFT.name}
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => setSelectedNFT(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {selectedNFT.collection}
                  </p>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedNFT.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={selectedNFT.marketplaceLogo}
                    alt={selectedNFT.marketplace}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-gray-400">{selectedNFT.marketplace}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-white">
                    {formatPrice(selectedNFT.price, selectedNFT.currency)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatUSD(selectedNFT.usdPrice)}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-1">Last Sale</p>
                  <p className="text-2xl font-bold text-white">
                    {formatPrice(selectedNFT.lastSale, selectedNFT.currency)}
                  </p>
                  <p
                    className={`text-sm ${selectedNFT.price < selectedNFT.lastSale ? "text-green-400" : "text-red-400"}`}
                  >
                    {selectedNFT.price < selectedNFT.lastSale ? "▼" : "▲"}{" "}
                    {Math.abs(
                      ((selectedNFT.price - selectedNFT.lastSale) /
                        selectedNFT.lastSale) *
                        100
                    ).toFixed(1)}
                    % from last
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Traits</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedNFT.traits.map((trait) => (
                    <div
                      key={trait.trait}
                      className="bg-gray-800 rounded-lg p-3 text-center"
                    >
                      <p className="text-xs text-purple-400 uppercase">
                        {trait.trait}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {trait.value}
                      </p>
                      <p className="text-xs text-gray-400">
                        {trait.rarity}% have this
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleBuy(selectedNFT)}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now
                </button>
                <button className="px-6 py-3 bg-gray-800 rounded-lg text-white font-semibold flex items-center gap-2 hover:bg-gray-700 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                  View on {selectedNFT.marketplace}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NFTMarketplaceAggregator;
