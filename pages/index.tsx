import React, { useState } from 'react';
import { ConnectWalletButton } from '../components/connect-wallet';
import { TokenList } from '../components/token-list';
import { TransactionHistory } from '../components/transaction-history';
import { NFTCard } from '../components/nft-card';
import { PriceTicker } from '../components/price-ticker';
import { NetworkSwitcher, Network } from '../components/network-switcher';

export default function Home() {
  const [currentNetwork, setCurrentNetwork] = useState<Network | undefined>();

  const handleConnect = (address: string) => {
    console.log('Connected wallet address:', address);
    alert(`Connected to wallet: ${address}`);
  };

  const handleError = (error: Error) => {
    console.error('Wallet connection error:', error);
  };

  const sampleTransactions = [
    {
      hash: '0x123...abc',
      from: '0xabc...def',
      to: '0xdef...789',
      value: '1000000000000000000', // 1 ETH
      timestamp: Math.floor(Date.now() / 1000),
      status: 'success' as const,
      nonce: 1,
      blockNumber: 12345678
    },
    {
      hash: '0x456...def',
      from: '0xabc...def',
      to: '0xghi...789',
      value: '500000000000000000', // 0.5 ETH
      timestamp: Math.floor(Date.now() / 1000) - 3600,
      status: 'pending' as const,
      nonce: 2
    },
    // Add more sample transactions...
  ];

  const sampleNFTs = [
    {
      id: '2',
      name: 'Bored Ape #5678',
      description: 'A unique Bored Ape NFT',
      image: 'https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ',
      owner: '0x9876543210fedcba9876543210fedcba98765432',
      collection: 'Bored Ape Yacht Club',
      tokenId: '5678',
      contractAddress: '0x123456789abcdef123456789abcdef1234567890',
      chainId: 1,
      attributes: [
        { trait_type: 'Background', value: 'Yellow' },
        { trait_type: 'Fur', value: 'Brown' },
        { trait_type: 'Eyes', value: 'Bored' },
        { trait_type: 'Clothes', value: 'Suit' }
      ]
    }
  ];

  const handleNetworkChange = (network: Network) => {
    setCurrentNetwork(network);
    console.log('Switched to network:', network.name);
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
              <h2 className="text-2xl font-bold mb-4">Network Switcher</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Default View</h3>
                  <NetworkSwitcher
                    currentNetwork={currentNetwork}
                    onNetworkChange={handleNetworkChange}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Minimal View</h3>
                  <NetworkSwitcher
                    currentNetwork={currentNetwork}
                    onNetworkChange={handleNetworkChange}
                    variant="minimal"
                  />
                </div>
              </div>
            </div>

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

            <div>
              <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
              <TransactionHistory 
                transactions={sampleTransactions}
                onTransactionClick={(tx) => console.log('Clicked transaction:', tx)}
                itemsPerPage={5}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">NFT Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    variant="expanded"
                    onOwnerClick={(owner) => console.log('Owner clicked:', owner)}
                    onNFTClick={(nft) => console.log('NFT clicked:', nft)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Price Ticker</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Detailed View</h3>
                  <PriceTicker 
                    tokens={['BTC', 'ETH', 'USDT', 'BNB', 'MATIC']}
                    refreshInterval={5000}
                    onPriceUpdate={(prices) => console.log('Updated prices:', prices)}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Compact View</h3>
                  <PriceTicker 
                    tokens={['BTC', 'ETH', 'USDT']}
                    variant="compact"
                    refreshInterval={5000}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 