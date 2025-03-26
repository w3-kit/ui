import React, { useState, useCallback } from 'react';
import Image from 'next/image';

export interface AirdropInfo {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
  amount: string;
  merkleRoot: string;
  merkleProof: string[];
  startTime: number;
  endTime: number;
  claimed: boolean;
  logoURI?: string;
}

interface TokenAirdropProps {
  airdrops: AirdropInfo[];
  onClaim: (airdropId: string) => Promise<void>;
}

const SuccessCheckmark: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="relative w-6 h-6">
      <div className="animate-success-circle absolute inset-0 rounded-full border-2 border-white" />
      <svg
        className="w-6 h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="animate-success-check"
          d="M6 12l4 4 8-8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="absolute inset-0 rounded-full animate-success-fill" />
    </div>
  </div>
);

export function TokenAirdrop({ airdrops, onClaim }: TokenAirdropProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const handleClaim = async (e: React.MouseEvent, airdropId: string) => {
    e.stopPropagation();
    try {
      setClaimingId(airdropId);
      await onClaim(airdropId);
      setShowSuccess(airdropId);
      setTimeout(() => {
        setShowSuccess(null);
      }, 2000); // Hide success animation after 2 seconds
    } finally {
      setClaimingId(null);
    }
  };

  const isActive = useCallback((airdrop: AirdropInfo) => {
    const now = Date.now();
    return now >= airdrop.startTime && now <= airdrop.endTime && !airdrop.claimed;
  }, []);

  const getStatus = useCallback((airdrop: AirdropInfo) => {
    const now = Date.now();
    if (airdrop.claimed) return 'claimed';
    if (now < airdrop.startTime) return 'upcoming';
    if (now > airdrop.endTime) return 'expired';
    return 'active';
  }, []);

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-400',
        label: 'Active'
      },
      claimed: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-400',
        label: 'Claimed'
      },
      expired: {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-800 dark:text-gray-400',
        label: 'Expired'
      },
      upcoming: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-400',
        label: 'Upcoming'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {airdrops.map((airdrop) => (
        <div
          key={airdrop.id}
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 
            dark:border-gray-700 p-5 cursor-pointer transition-all duration-200 ease-out
            hover:shadow-md"
          onClick={() => setExpandedId(expandedId === airdrop.id ? null : airdrop.id)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {airdrop.logoURI && (
                <Image
                  src={airdrop.logoURI}
                  alt={airdrop.tokenSymbol}
                  width={32}
                  height={32}
                  className="rounded-full bg-white dark:bg-gray-700"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>{airdrop.tokenName}</span>
                  <span className="text-sm text-gray-500">({airdrop.tokenSymbol})</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Amount: {airdrop.amount} {airdrop.tokenSymbol}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <StatusBadge status={getStatus(airdrop)} />
              <button 
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200
                  ${expandedId === airdrop.id ? 'rotate-180' : ''}`}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div 
            className={`transition-all duration-300 ease-out overflow-hidden
              ${expandedId === airdrop.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Start Time</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(airdrop.startTime)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">End Time</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(airdrop.endTime)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Token Address</p>
                <p className="font-medium text-gray-900 dark:text-white font-mono text-sm truncate">
                  {airdrop.tokenAddress}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Merkle Root</p>
                <p className="font-medium text-gray-900 dark:text-white font-mono text-sm truncate">
                  {airdrop.merkleRoot}
                </p>
              </div>
            </div>

            {isActive(airdrop) && (
              <button
                onClick={(e) => handleClaim(e, airdrop.id)}
                disabled={claimingId === airdrop.id}
                className="w-full mt-4 inline-flex justify-center items-center px-4 py-2.5 
                  border border-transparent text-sm font-medium rounded-lg text-white 
                  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
                  disabled:cursor-not-allowed transition-all duration-200 ease-out
                  dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800
                  active:translate-y-0.5"
              >
                {showSuccess === airdrop.id ? (
                  <SuccessCheckmark />
                ) : claimingId === airdrop.id ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Claiming Airdrop...
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Claim Airdrop
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
