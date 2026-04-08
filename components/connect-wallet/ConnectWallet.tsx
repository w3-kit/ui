"use client";

import React, { useState, useCallback } from "react";
import { Wallet, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface EIP1193Provider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

interface CoinbaseWalletProvider {
  request: (args: { method: string }) => Promise<string[]>;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    coinbaseWalletExtension?: CoinbaseWalletProvider;
  }
}

export interface ConnectWalletButtonProps {
  onConnect?: (address: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function ConnectWalletButton({
  onConnect,
  onError,
  className,
}: ConnectWalletButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleConnect = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet detected. Please install MetaMask.");
      }

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts.length > 0) {
        setConnectedAddress(accounts[0]);
        onConnect?.(accounts[0]);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to connect wallet");
      onError?.(error);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, onConnect, onError]);

  const handleDisconnect = useCallback(() => {
    setConnectedAddress(null);
  }, []);

  if (connectedAddress) {
    return (
      <Button
        variant="outline"
        onClick={handleDisconnect}
        className={cn("gap-2", className)}
      >
        <Wallet className="h-4 w-4" />
        <span className="font-mono text-xs">{formatAddress(connectedAddress)}</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className={cn("gap-2", className)}
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}

export default ConnectWalletButton;
