'use client';

import React, { useState, useCallback } from 'react';
import { ConnectWalletButtonProps } from './types';
import {
  variantStyles,
  DEFAULT_WALLETCONNECT_CONFIG,
  WALLET_ICONS,
  getDefaultLabel,
  buttonAnimation,
  spinnerAnimation,
} from './utils';
import '../../../lib/ethereum';

// Phantom wallet icon as inline SVG
const PhantomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 128 128" fill="none">
    <rect width="128" height="128" rx="64" fill="#AB9FF2"/>
    <path d="M110.984 64.206C110.984 89.2476 90.7077 109.524 65.666 109.524C40.6244 109.524 20.3477 89.2476 20.3477 64.206C20.3477 39.1644 40.6244 18.8877 65.666 18.8877C90.7077 18.8877 110.984 39.1644 110.984 64.206Z" fill="white"/>
  </svg>
);

// Loading spinner component
const LoadingSpinner = () => (
  <svg className={spinnerAnimation} viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  onConnect,
  onError,
  className = '',
  customLabel,
  variant = 'dark',
  walletType = 'metamask',
  walletConnectConfig: _walletConnectConfig = DEFAULT_WALLETCONNECT_CONFIG,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectEIP1193 = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('No wallet found. Please install a browser wallet.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        onConnect?.(accounts[0] as string);
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onConnect, onError]);

  const connectCoinbase = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.coinbaseWalletExtension) {
        throw new Error('Coinbase Wallet is not installed');
      }

      const accounts = await window.coinbaseWalletExtension.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        onConnect?.(accounts[0]);
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onConnect, onError]);

  const connectPhantom = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.phantom?.solana) {
        throw new Error('Phantom wallet is not installed');
      }

      const response = await window.phantom.solana.connect();
      const address = response.publicKey.toString();
      onConnect?.(address);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onConnect, onError]);

  const handleConnect = useCallback(() => {
    switch (walletType) {
      case 'metamask':
        return connectEIP1193();
      case 'walletconnect':
        return connectEIP1193();
      case 'coinbase':
        return connectCoinbase();
      case 'phantom':
        return connectPhantom();
      default:
        return connectEIP1193();
    }
  }, [walletType, connectEIP1193, connectCoinbase, connectPhantom]);

  const renderWalletIcon = () => {
    if (walletType === 'phantom') {
      return <PhantomIcon />;
    }

    const iconUrl = WALLET_ICONS[walletType];
    return (
      <img
        src={iconUrl}
        alt={walletType}
        width={24}
        height={24}
        className="rounded-sm"
      />
    );
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`
          px-6 py-3 rounded-xl font-medium
          flex items-center justify-center min-w-[240px]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${buttonAnimation}
          ${variantStyles[variant]}
          ${className}
        `}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner />
            <span>Connecting...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 flex items-center justify-center">
              {renderWalletIcon()}
            </div>
            <span className="text-[15px]">{customLabel || getDefaultLabel(walletType)}</span>
          </div>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
