"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { NetworkSwitcherProps } from "./types";

export function NetworkSwitcher({
  networks,
  testNetworks,
  onSwitch,
  className = "",
}: NetworkSwitcherProps) {
  const [showTestnets, setShowTestnets] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const networkStatus: "connected" | "connecting" | "error" = "connected";
  const gasPrice = "";
  const latency = 0;

  const currentNetworks = showTestnets ? testNetworks : networks;

  const filteredNetworks = currentNetworks.filter(
    (network) =>
      network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      network.chainId.toString().includes(searchQuery)
  );

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      setIsLoading(true);
      setSelectedChainId(chainId);
      await onSwitch(chainId);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedNetwork = [...networks, ...testNetworks].find(
    (n) => n.chainId === selectedChainId
  );

  function StatusIndicator() {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            networkStatus === "connected"
              ? "bg-success"
              : networkStatus === "connecting"
              ? "bg-warning"
              : "bg-destructive"
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {networkStatus === "connected"
            ? "Connected"
            : networkStatus === "connecting"
            ? "Connecting..."
            : "Error"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`bg-card rounded-lg border shadow-sm w-full max-w-3xl mx-auto transition-all
      duration-300 ease-in-out transform hover:shadow-sm ${className}`}
    >
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Network
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Select a blockchain network to connect to
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search networks..."
                className="w-full px-3 py-1.5 text-sm border
                  rounded-lg bg-background text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 p-0"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestnets(!showTestnets)}
              className="text-xs sm:text-sm whitespace-nowrap"
            >
              {showTestnets ? "Show Mainnets" : "Show Testnets"}
            </Button>
          </div>
        </div>
      </div>

      {/* Network Status */}
      <div
        className="px-4 sm:px-6 py-3 bg-muted/50
        border-b"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusIndicator />
          {gasPrice && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="text-sm text-muted-foreground">
                Gas: {gasPrice} Gwei
              </span>
            </div>
          )}
          {latency > 0 && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-muted-foreground">
                Latency: {latency}ms
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Networks Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredNetworks.map((network) => (
            <Button
              key={network.chainId}
              variant={selectedChainId === network.chainId ? "default" : "outline"}
              onClick={() => handleNetworkSwitch(network.chainId)}
              disabled={isLoading}
              className={`relative p-4 h-auto text-left justify-start hover:shadow-sm
                ${selectedChainId === network.chainId ? "border-primary" : ""}`}
            >
              <div className="flex items-center space-x-3 w-full">
                {network.logoURI && (
                  <div className="relative w-8 h-8">
                    <img
                      src={network.logoURI}
                      alt={network.name}
                      width={32}
                      height={32}
                      className="rounded-full object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {network.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Chain ID: {network.chainId}
                  </div>
                </div>
                {selectedChainId === network.chainId && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {filteredNetworks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No networks found matching your search
          </div>
        )}

        {/* Network Details */}
        {selectedNetwork && (
          <div
            className="mt-6 border rounded-lg
            divide-y text-sm"
          >
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-muted-foreground">RPC URL</span>
              <code
                className="text-xs sm:text-sm text-foreground font-mono bg-muted
                px-2 py-1 rounded break-all"
              >
                {selectedNetwork.rpcUrl}
              </code>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-medium text-foreground">
                {selectedNetwork.currency}
              </span>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-muted-foreground">Explorer</span>
              <a
                href={selectedNetwork.blockExplorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                View Explorer
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-muted-foreground">
                Connection
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm text-foreground">
                    RPC
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm text-foreground">
                    WebSocket
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NetworkSwitcher;
