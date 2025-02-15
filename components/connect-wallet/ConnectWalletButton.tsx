import React, { useState, useCallback } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    coinbaseWalletExtension?: any;
    solana?: any;
    phantom?: {
      solana?: {
        connect(): Promise<{ publicKey: { toString(): string } }>;
      };
    };
  }
}

type ButtonVariant = 'ghost' | 'light' | 'dark';
type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'phantom';

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
    <svg className="w-6 h-6 mr-2" viewBox="0 0 318.6 318.6" fill="none">
      <path d="M274.1 35.5l-99.5 73.9L193 65.8z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5zm111.3 0l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5l33.9 16.5-4.7-39.3z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  walletconnect: (
    <svg className="w-6 h-6 mr-2" viewBox="0 0 96 96" fill="none">
      <path
        d="M25.322 33.597c12.525-12.263 32.83-12.263 45.355 0l1.507 1.476a1.547 1.547 0 0 1 0 2.22l-5.156 5.048a.814.814 0 0 1-1.134 0l-2.074-2.03c-8.737-8.555-22.903-8.555-31.64 0l-2.222 2.175a.814.814 0 0 1-1.134 0l-5.156-5.049a1.547 1.547 0 0 1 0-2.22l1.654-1.62zm56.019 10.44l4.589 4.494a1.547 1.547 0 0 1 0 2.22l-20.693 20.26a1.628 1.628 0 0 1-2.267 0L48.283 56.632a.407.407 0 0 0-.567 0L33.03 71.011a1.628 1.628 0 0 1-2.267 0L10.07 50.75a1.547 1.547 0 0 1 0-2.22l4.59-4.494a1.628 1.628 0 0 1 2.266 0l14.687 14.38a.407.407 0 0 0 .567 0l14.685-14.38a1.628 1.628 0 0 1 2.267 0l14.687 14.38a.407.407 0 0 0 .567 0l14.687-14.38a1.628 1.628 0 0 1 2.267 0z"
        fill="#3B99FC"
      />
    </svg>
  ),
  coinbase: (
    <svg className="w-6 h-6 mr-2" viewBox="0 0 1024 1024" fill="none">
      <circle cx="512" cy="512" r="512" fill="#0052FF"/>
      <path d="M512 152C306.6 152 140 318.6 140 524s166.6 372 372 372 372-166.6 372-372S717.4 152 512 152zm0 560c-104 0-188-84-188-188s84-188 188-188 188 84 188 188-84 188-188 188z" fill="white"/>
    </svg>
  ),
  phantom: (
    <svg className="w-6 h-6 mr-2" viewBox="0 0 128 128" fill="none">
      <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z" fill="#AB9FF2"/>
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
      case 'phantom':
        return 'Phantom Wallet';
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
        return connectMetaMask();
      case 'walletconnect':
        return connectWalletConnect();
      case 'coinbase':
        return connectCoinbase();
      case 'phantom':
        return connectPhantom();
      default:
        return connectMetaMask();
    }
  }, [walletType, connectMetaMask, connectWalletConnect, connectCoinbase, connectPhantom]);

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