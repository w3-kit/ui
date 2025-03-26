import React, { useState, useCallback } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import Image from 'next/image';

interface CoinbaseWalletProvider {
  request: (args: { method: string }) => Promise<string[]>;
}

interface SolanaProvider {
  connect(): Promise<{ publicKey: { toString(): string } }>;
}

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    coinbaseWalletExtension?: CoinbaseWalletProvider;
    solana?: SolanaProvider;
    phantom?: {
      solana?: SolanaProvider;
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
  ghost: `
    bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 
    text-gray-900 dark:text-gray-100
    border-2 border-gray-200 dark:border-gray-700
    hover:border-gray-300 dark:hover:border-gray-600
    shadow-sm hover:shadow
    transition-all duration-200
  `,
  light: `
    bg-white dark:bg-gray-800 
    hover:bg-gray-50 dark:hover:bg-gray-700
    text-gray-900 dark:text-gray-100 
    border border-gray-200 dark:border-gray-700
    hover:border-gray-300 dark:hover:border-gray-600
    shadow-sm hover:shadow
    transition-all duration-200
  `,
  dark: `
    bg-gray-900 dark:bg-gray-100
    hover:bg-gray-800 dark:hover:bg-white
    text-white dark:text-gray-900
    border border-transparent
    shadow-md hover:shadow-lg
    transition-all duration-200
  `,
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
    <Image 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png"
      alt="MetaMask"
      width={24}
      height={24}
      className="rounded-sm"
    />
  ),
  walletconnect: (
    <Image
      src="https://cdn-images-1.medium.com/max/1200/1*fgRGbOjhoJMHqh9czHETZQ.png"
      alt="WalletConnect"
      width={24}
      height={24}
    />
  ),
  coinbase: (
    <Image
      src="https://cdn.iconscout.com/icon/free/png-256/free-coinbase-logo-icon-download-in-svg-png-gif-file-formats--web-crypro-trading-platform-logos-pack-icons-7651204.png"
      alt="Coinbase"
      width={24}
      height={24}
      className="rounded-sm"
    />
  ),
  phantom: (
    <svg width="24" height="24" viewBox="0 0 128 128" fill="none">
      <rect width="128" height="128" rx="64" fill="#AB9FF2"/>
      <path d="M110.984 64.206C110.984 89.2476 90.7077 109.524 65.666 109.524C40.6244 109.524 20.3477 89.2476 20.3477 64.206C20.3477 39.1644 40.6244 18.8877 65.666 18.8877C90.7077 18.8877 110.984 39.1644 110.984 64.206Z" fill="white"/>
    </svg>
  )
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
      // First check if MetaMask is actually installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Check if the provider is actually MetaMask
     
      if (!window.ethereum.isMetaMask) {
        throw new Error('Please switch to MetaMask');
      }

      // This is the actual connection request to MetaMask
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
      // Check specifically for Coinbase Wallet
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
          px-6 py-3 rounded-xl font-medium
          flex items-center justify-center min-w-[240px]
          disabled:opacity-50 disabled:cursor-not-allowed
          transform hover:scale-[1.02] active:scale-[0.98]
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
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 flex items-center justify-center">
              {WalletIcons[walletType]}
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