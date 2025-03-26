import React, { useState, useCallback, useMemo } from 'react';

export interface VestingSchedule {
  id: string;
  tokenSymbol: string;
  totalAmount: string;
  vestedAmount: string;
  startDate: number;
  endDate: number;
  cliffDate: number;
  lastClaimDate: number | null;
  beneficiary: string;
  status: 'active' | 'completed' | 'pending';
}

interface TokenVestingProps {
  vestingSchedules: VestingSchedule[];
  onClaimTokens: (scheduleId: string) => Promise<void>;
}

const StatusBadge: React.FC<{ status: VestingSchedule['status'] }> = ({ status }) => {
  const statusConfig = {
    active: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-400',
      label: 'Active'
    },
    completed: {
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      text: 'text-gray-800 dark:text-gray-400',
      label: 'Completed'
    },
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-400',
      label: 'Pending'
    }
  };

  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export function TokenVesting({ vestingSchedules, onClaimTokens }: TokenVestingProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const calculateProgress = useCallback((schedule: VestingSchedule) => {
    const now = Date.now();
    const total = schedule.endDate - schedule.startDate;
    const current = now - schedule.startDate;
    return Math.min(Math.max((current / total) * 100, 0), 100);
  }, []);

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const handleClaim = async (e: React.MouseEvent, scheduleId: string) => {
    e.stopPropagation();
    try {
      setClaimingId(scheduleId);
      await onClaimTokens(scheduleId);
    } finally {
      setClaimingId(null);
    }
  };

  const isClaimable = useCallback((schedule: VestingSchedule) => {
    const now = Date.now();
    return (
      schedule.status === 'active' &&
      now >= schedule.cliffDate &&
      parseFloat(schedule.vestedAmount) < parseFloat(schedule.totalAmount)
    );
  }, []);

  const sortedSchedules = useMemo(() => {
    return [...vestingSchedules].sort((a, b) => {
      const statusOrder = { active: 0, pending: 1, completed: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [vestingSchedules]);

  return (
    <div className="space-y-4">
      {sortedSchedules.map((schedule, index) => (
        <div
          key={schedule.id}
          className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
            dark:border-gray-700 p-4 cursor-pointer transition-all duration-200 ease-out
            hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          onClick={() => setExpandedId(expandedId === schedule.id ? null : schedule.id)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {schedule.tokenSymbol} Vesting
              </h3>
              <StatusBadge status={schedule.status} />
            </div>
            <button 
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-200
                ${expandedId === schedule.id ? 'rotate-180' : ''}`}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {calculateProgress(schedule).toFixed(1)}%
              </span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                  animate-shimmer"
                style={{ '--tw-translate-x': '-100%' } as React.CSSProperties}
              />
              <div
                className="bg-blue-500 dark:bg-blue-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${calculateProgress(schedule)}%` }}
              />
            </div>
          </div>

          <div 
            className={`mt-4 transition-all duration-300 ease-out overflow-hidden
              ${expandedId === schedule.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Total Amount</span>
                <p className="font-medium text-gray-900 dark:text-white mt-1">
                  {schedule.totalAmount} {schedule.tokenSymbol}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Vested Amount</span>
                <p className="font-medium text-gray-900 dark:text-white mt-1">
                  {schedule.vestedAmount} {schedule.tokenSymbol}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Cliff Date</span>
                <p className="font-medium text-gray-900 dark:text-white mt-1">
                  {formatDate(schedule.cliffDate)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg transition-colors duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Last Claimed</span>
                <p className="font-medium text-gray-900 dark:text-white mt-1">
                  {schedule.lastClaimDate ? formatDate(schedule.lastClaimDate) : 'Never'}
                </p>
              </div>
            </div>

            {isClaimable(schedule) && (
              <button
                onClick={(e) => handleClaim(e, schedule.id)}
                disabled={claimingId === schedule.id}
                className="w-full mt-4 inline-flex justify-center items-center px-4 py-3 
                  border border-transparent text-sm font-medium rounded-lg text-white 
                  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
                  disabled:cursor-not-allowed transition-all duration-200 ease-out
                  dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800
                  active:translate-y-0.5"
              >
                {claimingId === schedule.id ? (
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
                    Claiming Tokens...
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
                    Claim Available Tokens
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
