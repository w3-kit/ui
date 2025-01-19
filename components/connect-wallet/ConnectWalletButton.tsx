import React, { useState, useCallback } from 'react';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

type ButtonVariant = 'ghost' | 'light' | 'dark';

interface ConnectWalletButtonProps {
  onConnect?: (address: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  customLabel?: string;
  variant?: ButtonVariant;
}

const variantStyles = {
  ghost: `bg-transparent hover:bg-gray-100 text-gray-700 border-2 border-gray-300
    hover:border-gray-400`,
  light: `bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 
    hover:border-gray-300 shadow-sm`,
  dark: `bg-gray-900 hover:bg-gray-800 text-white shadow-md 
    hover:shadow-lg`,
};

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  onConnect,
  onError,
  className = '',
  customLabel = 'Connect Wallet',
  variant = 'dark'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={connectMetaMask}
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
            <span>{customLabel}</span>
          </div>
        )}
      </button>
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}; 