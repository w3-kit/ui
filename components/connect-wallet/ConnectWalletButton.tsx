import React, { useState, useCallback } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    coinbaseWalletExtension?: any;
  }
}

type ButtonVariant = 'ghost' | 'light' | 'dark';
type WalletType = 'metamask' | 'walletconnect' | 'coinbase';

interface ConnectWalletButtonProps {
  onConnect?: (address: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  customLabel?: string;
  variant?: ButtonVariant;
  walletType?: WalletType;
}

const variantStyles = {
  ghost: `bg-transparent hover:bg-gray-100 text-gray-700 border-2 border-gray-300
    hover:border-gray-400`,
  light: `bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 
    hover:border-gray-300 shadow-sm`,
  dark: `bg-gray-900 hover:bg-gray-800 text-white shadow-md 
    hover:shadow-lg`,
};

const walletConnectConfig = {
  rpc: {
    1: 'https://mainnet.infura.io/v3/YOUR_INFURA_ID', // Replace with your Infura ID
    4: 'https://rinkeby.infura.io/v3/YOUR_INFURA_ID',
  },
  bridge: 'https://bridge.walletconnect.org',
};

const WalletIcons = {
  metamask: (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 35 33" fill="none">
      <path d="M32.9582 1L19.8241 10.7183L22.2665 4.99099L32.9582 1Z" fill="currentColor" fillOpacity="0.8"/>
      <path d="M2.04183 1L15.0446 10.809L12.7335 4.99099L2.04183 1Z" fill="currentColor" fillOpacity="0.8"/>
      <path d="M28.2036 23.3094L24.7358 28.5863L32.2621 30.6244L34.3857 23.4519L28.2036 23.3094Z" fill="currentColor" fillOpacity="0.8"/>
      <path d="M0.623322 23.4519L2.73785 30.6244L10.2642 28.5863L6.79636 23.3094L0.623322 23.4519Z" fill="currentColor" fillOpacity="0.8"/>
    </svg>
  ),
  walletconnect: (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
      <path d="M6 16.5L12 21l6-4.5M6 7.5L12 3l6 4.5M12 21v-4.5m0-9V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  coinbase: (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  onConnect,
  onError,
  className = '',
  customLabel,
  variant = 'dark',
  walletType = 'metamask'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDefaultLabel = (type: WalletType) => {
    switch (type) {
      case 'metamask':
        return 'Connect MetaMask';
      case 'walletconnect':
        return 'WalletConnect';
      case 'coinbase':
        return 'Coinbase Wallet';
      default:
        return 'Connect Wallet';
    }
  };

  const connectMetaMask = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
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

  const connectWalletConnect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const connector = new WalletConnectConnector({
        rpc: walletConnectConfig.rpc,
        bridge: walletConnectConfig.bridge,
        qrcode: true,
      });

      await connector.activate();
      const account = await connector.getAccount();
      if (account) {
        onConnect?.(account);
      } else {
        throw new Error('No account found');
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

  const handleConnect = useCallback(() => {
    switch (walletType) {
      case 'metamask':
        return connectMetaMask();
      case 'walletconnect':
        return connectWalletConnect();
      case 'coinbase':
        return connectCoinbase();
      default:
        return connectMetaMask();
    }
  }, [walletType, connectMetaMask, connectWalletConnect, connectCoinbase]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`
          px-6 py-2.5 rounded-lg font-medium transition-all duration-200
          flex items-center justify-center min-w-[200px]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${className}
        `}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            <span>Connecting...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {WalletIcons[walletType]}
            <span>{customLabel || getDefaultLabel(walletType)}</span>
          </div>
        )}
      </button>
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}; 