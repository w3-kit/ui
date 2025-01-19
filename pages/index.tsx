import React from 'react';
import { ConnectWalletButton } from '../components/connect-wallet';
import { TokenList } from '../components/token-list';

export default function Home() {
  const handleConnect = (address: string) => {
    console.log('Connected wallet address:', address);
    alert(`Connected to wallet: ${address}`);
  };

  const handleError = (error: Error) => {
    console.error('Wallet connection error:', error);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Blockchain UI Library Demo
          </h1>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                MetaMask
              </h2>
              <div className="mb-4">
                <ConnectWalletButton
                  onConnect={handleConnect}
                  onError={handleError}
                  variant="ghost"
                  walletType="metamask"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                WalletConnect
              </h2>
              <div className="mb-4">
                <ConnectWalletButton
                  onConnect={handleConnect}
                  onError={handleError}
                  variant="dark"
                  walletType="walletconnect"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Coinbase Wallet
              </h2>
              <div className="mb-4">
                <ConnectWalletButton
                  onConnect={handleConnect}
                  onError={handleError}
                  variant="dark"
                  walletType="coinbase"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">All Tokens</h2>
              <TokenList 
                tokens={[
                  'ETH', 'BTC', 'USDT', 'USDC', 'BNB', 'XRP', 'USDD', 'ADA',
                  'DOGE', 'MATIC', 'DAI', 'DOT', 'SHIB', 'TRX', 'SOL', 'AVAX',
                  'UNI', 'LINK', 'FPI'
                ]}
                onTokenSelect={(token) => console.log('Selected:', token)}
                variant="table"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Grid View</h2>
              <TokenList 
                tokens={['DOT', 'AVAX', 'LINK', 'UNI']}
                onTokenSelect={(token) => console.log('Selected:', token)}
                variant="grid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 