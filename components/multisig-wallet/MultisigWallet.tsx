import React, { useState, useEffect, useRef } from 'react';
import { MultisigWalletProps } from './types';
import { formatAddress, formatTimestamp } from './utils';


export const MultisigWallet: React.FC<MultisigWalletProps> = ({
  walletAddress,
  signers,
  transactions,
  requiredApprovals,
  onPropose,
  onApprove,
  onReject,
  className = ''
}) => {
  const [isProposing, setIsProposing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'executed' | 'all'>('pending');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [newTransactions, setNewTransactions] = useState<Set<string>>(new Set());
  const [formErrors, setFormErrors] = useState<{
    description?: string;
    to?: string;
    value?: string;
    data?: string;
    submit?: string;
  }>({});
  const lastTransactionRef = useRef<HTMLDivElement>(null);
  const [newTx, setNewTx] = useState({
    description: '',
    to: '',
    value: '',
    data: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);

  // Add state to manage transactions locally
  const [localTransactions, setLocalTransactions] = useState(transactions);

  // Update transactions when prop changes
  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  // Track new transactions
  useEffect(() => {
    if (transactions.length > 0) {
      const latestTx = transactions[0];
      if (latestTx && !newTransactions.has(latestTx.id)) {
        setNewTransactions(prev => new Set([...prev, latestTx.id]));
      }
    }
  }, [transactions]);

  // Validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Validate form
  const validateForm = () => {
    const errors: typeof formErrors = {};

    if (!newTx.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!newTx.to) {
      errors.to = 'Address is required';
    } else if (!isValidAddress(newTx.to)) {
      errors.to = 'Invalid Ethereum address';
    }

    if (!newTx.value) {
      errors.value = 'Value is required';
    } else if (isNaN(Number(newTx.value)) || Number(newTx.value) < 0) {
      errors.value = 'Invalid value';
    }

    if (newTx.data && !/^0x[a-fA-F0-9]*$/.test(newTx.data)) {
      errors.data = 'Invalid hex data';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePropose = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      const newTxId = `tx-${Date.now()}`;
      const transaction = {
        ...newTx,
        id: newTxId,
        proposer: signers[0]?.address || '',
        approvals: 0,
        status: 'pending' as const,
        timestamp: Date.now(),
        requiredApprovals,
        signers: signers.map(s => ({ ...s, hasApproved: false }))
      };

      await onPropose?.(transaction);
      setIsProposing(false);
      setNewTx({ description: '', to: '', value: '', data: '' });
      setFormErrors({});

      // Only switch to pending if we're in executed tab
      if (activeTab === 'executed') {
        setActiveTab('pending');
      }
      // Stay in current tab otherwise (all or pending)

    } catch (error) {
      console.error('Error creating transaction:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: 'Failed to create transaction. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle copy address with error handling
  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
      // You could show a toast/notification here
    }
  };

  // Scroll to new transaction
  useEffect(() => {
    if (lastTransactionRef.current) {
      lastTransactionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [transactions.length]);



  // Update the approve handler
  const handleApprove = async (txId: string) => {
    try {
      setIsApproving(txId);
      
      const tx = localTransactions.find(t => t.id === txId);
      if (!tx) return;

      // Check if current signer has already approved
      const currentSigner = signers[0]?.address;
      const hasAlreadyApproved = tx.signers.find(s => s.address === currentSigner)?.hasApproved;
      
      if (hasAlreadyApproved) {
        return; // Already approved, do nothing
      }

      const updatedTransactions = localTransactions.map(tx => {
        if (tx.id === txId) {
          const newApprovals = tx.approvals + 1;
          const newStatus = newApprovals >= tx.requiredApprovals ? 'executed' as const : 'pending' as const;
          
          return {
            ...tx,
            approvals: newApprovals,
            status: newStatus,
            signers: tx.signers.map(s => 
              s.address === currentSigner ? { ...s, hasApproved: true } : s
            )
          };
        }
        return tx;
      });

      setLocalTransactions(updatedTransactions);
      await onApprove?.(txId);
      setExpandedTx(null); // Close the card
    } catch (error) {
      console.error('Error approving transaction:', error);
    } finally {
      setIsApproving(null);
    }
  };

  // Update the reject handler
  const handleReject = async (txId: string) => {
    try {
      setIsRejecting(txId);
      
      const tx = localTransactions.find(t => t.id === txId);
      if (!tx) return;

      const hasAlreadyRejected = tx.status === 'rejected';
      
      if (hasAlreadyRejected) {
        return; // Already rejected, do nothing
      }

      const updatedTransactions = localTransactions.map(tx => {
        if (tx.id === txId) {
          return {
            ...tx,
            status: 'rejected' as const,
            approvals: 0, // Reset approvals
            signers: tx.signers.map(s => ({ 
              ...s, 
              hasApproved: false // Set all signers to not approved
            }))
          };
        }
        return tx;
      });

      setLocalTransactions(updatedTransactions);
      await onReject?.(txId);
      setExpandedTx(null);
    } catch (error) {
      console.error('Error rejecting transaction:', error);
    } finally {
      setIsRejecting(null);
    }
  };

  // Update the filtered transactions to use local state
  const filteredTransactions = localTransactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(tx => activeTab === 'all' || tx.status === activeTab);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
      shadow-sm transition-all duration-300 hover:shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Multi-Signature Wallet</h2>
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Address:</span>
              <div className="group relative">
                <code 
                  onClick={() => handleCopyAddress(walletAddress)}
                  className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 
                    dark:text-white cursor-pointer transition-colors duration-200 hover:bg-gray-200 
                    dark:hover:bg-gray-600"
                >
                  {formatAddress(walletAddress)}
                </code>
                <span className="invisible group-hover:visible absolute -top-8 left-1/2 transform 
                  -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 dark:bg-gray-100 text-white 
                  dark:text-gray-900 rounded shadow-lg whitespace-nowrap transition-all duration-200">
                  {copiedAddress === walletAddress ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Required Approvals</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {requiredApprovals}/{signers.length}
            </div>
          </div>
        </div>
      </div>

      {/* Signers */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Signers</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {signers.length} signer{signers.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {signers.map((signer) => (
            <div
              key={signer.address}
              className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-3 rounded-lg 
                border border-gray-200 dark:border-gray-700 transition-all duration-200 
                hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 group"
            >
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center 
                justify-center transition-transform duration-200 group-hover:scale-110 flex-shrink-0">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {signer.name?.[0] || 'S'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                {signer.name && (
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {signer.name}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <code className="text-xs text-gray-500 dark:text-gray-400 truncate 
                    group-hover:text-blue-500 transition-colors cursor-pointer"
                    onClick={() => handleCopyAddress(signer.address)}
                  >
                    {formatAddress(signer.address)}
                  </code>
                  {copiedAddress === signer.address && (
                    <span className="text-xs text-green-500">Copied!</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['pending', 'executed', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-all duration-200
                  ${activeTab === tab 
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsProposing(true)}
            className="inline-flex items-center px-3 py-1.5 bg-gray-900 dark:bg-gray-100 
              text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-200 
              transition-all duration-200 text-sm hover:shadow-md active:scale-95"
          >
            <svg className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Transaction
          </button>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 
          scrollbar-track-transparent">
          {filteredTransactions.map((tx, index) => (
            <div
              key={tx.id}
              ref={index === 0 ? lastTransactionRef : null}
              className={`group border border-gray-200 dark:border-gray-700 rounded-lg 
                bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 
                hover:-translate-y-0.5 hover:shadow-md 
                ${newTransactions.has(tx.id) ? 'animate-slide-up' : ''}`}
              onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
            >
              <div className="p-4 cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      <span className="truncate">{tx.description}</span>
                      <svg 
                        className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 
                          ${expandedTx === tx.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 9l-7 7-7-7" />
                      </svg>
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center mt-1 space-y-2 
                      sm:space-y-0 sm:space-x-4">
                      <div className="group">
                        <code 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyAddress(tx.to);
                          }}
                          className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer 
                            hover:text-blue-500 transition-colors truncate block"
                        >
                          To: {formatAddress(tx.to)}
                        </code>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Value: {Number(tx.value).toLocaleString()} ETH
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap
                      ${tx.status === 'executed' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : tx.status === 'rejected'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-3 
                  overflow-hidden">
                  <div
                    className="bg-gray-900 dark:bg-gray-100 h-1.5 rounded-full transition-all 
                      duration-700 ease-out"
                    style={{ width: `${(tx.approvals / tx.requiredApprovals) * 100}%` }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between 
                  text-sm text-gray-500 dark:text-gray-400 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {tx.signers.filter(s => s.hasApproved).map((signer) => (
                        <div
                          key={signer.address}
                          className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 
                            flex items-center justify-center ring-2 ring-white dark:ring-gray-800"
                          title={signer.name || formatAddress(signer.address)}
                        >
                          <span className="text-xs font-medium">
                            {signer.name?.[0] || 'S'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span>{tx.approvals} of {tx.requiredApprovals} approvals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-right">
                      Proposed {formatTimestamp(tx.timestamp)}
                    </span>
                    {tx.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(tx.id);
                          }}
                          disabled={
                            isApproving === tx.id || 
                            isRejecting === tx.id || 
                            tx.signers.find(s => s.address === signers[0]?.address)?.hasApproved ||
                            tx.status as string !== 'pending'
                          }
                          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Approve"
                        >
                          {isApproving === tx.id ? (
                            <div className="w-4 h-4 border-2 border-green-500 
                              border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" 
                              stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(tx.id);
                          }}
                          disabled={
                            isApproving === tx.id || 
                            isRejecting === tx.id || 
                            tx.status !== 'pending'
                          }
                          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reject"
                        >
                          {isRejecting === tx.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 
                              border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" 
                              stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`transition-all duration-300 ease-out overflow-hidden
                  ${expandedTx === tx.id ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="px-4 pb-4">
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Approvals
                    </h5>
                    <div className="space-y-2">
                      {tx.signers.map((signer) => (
                        <div 
                          key={signer.address}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center
                              transition-colors duration-200
                              ${signer.hasApproved 
                                ? 'bg-green-100 dark:bg-green-900/30' 
                                : 'bg-gray-100 dark:bg-gray-700'}`}
                            >
                              {signer.hasApproved && (
                                <svg className="w-3 h-3 text-green-700 dark:text-green-400" 
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" 
                                    strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm transition-colors duration-200
                              ${tx.status === 'rejected'
                                ? 'text-red-700 dark:text-red-400'
                                : signer.hasApproved 
                                  ? 'text-green-700 dark:text-green-400' 
                                  : 'text-gray-500 dark:text-gray-400'}`}
                            >
                              {tx.status === 'rejected' 
                                ? 'Rejected' 
                                : signer.hasApproved 
                                  ? 'Approved' 
                                  : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(tx.id);
                      }}
                      disabled={
                        isApproving === tx.id || 
                        isRejecting === tx.id || 
                        tx.signers.find(s => s.address === signers[0]?.address)?.hasApproved ||
                        !['pending'].includes(tx.status)
                      }
                      className="flex-1 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white 
                        dark:text-gray-900 rounded text-sm hover:bg-gray-800 dark:hover:bg-gray-200 
                        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApproving === tx.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(tx.id);
                      }}
                      disabled={
                        isApproving === tx.id || 
                        isRejecting === tx.id || 
                        tx.status !== 'pending'
                      }
                      className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-gray-700 
                        rounded text-sm text-gray-900 dark:text-white hover:bg-gray-50 
                        dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      {isRejecting === tx.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {activeTab === 'pending' 
                ? 'No pending transactions'
                : activeTab === 'executed'
                ? 'No executed transactions'
                : 'No transactions found'}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isProposing && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center 
            justify-center z-50 animate-fade-in"
          onClick={() => setIsProposing(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 shadow-2xl 
              animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">New Transaction</h3>
              <button
                onClick={() => setIsProposing(false)}
                className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description
                </label>
                <input
                  type="text"
                  value={newTx.description}
                  onChange={(e) => {
                    setNewTx({ ...newTx, description: e.target.value });
                    setFormErrors(prev => ({ ...prev, description: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md 
                    focus:outline-none focus:ring-1 focus:ring-black
                    ${formErrors.description ? 'border-red-500' : ''}`}
                  placeholder="Enter transaction description"
                />
                {formErrors.description && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  To Address
                </label>
                <input
                  type="text"
                  value={newTx.to}
                  onChange={(e) => {
                    setNewTx({ ...newTx, to: e.target.value });
                    setFormErrors(prev => ({ ...prev, to: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md font-mono
                    focus:outline-none focus:ring-1 focus:ring-black
                    ${formErrors.to ? 'border-red-500' : ''}`}
                  placeholder="0x..."
                />
                {formErrors.to && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.to}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Value (ETH)
                </label>
                <input
                  type="number"
                  value={newTx.value}
                  onChange={(e) => {
                    setNewTx({ ...newTx, value: e.target.value });
                    setFormErrors(prev => ({ ...prev, value: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md
                    focus:outline-none focus:ring-1 focus:ring-black
                    ${formErrors.value ? 'border-red-500' : ''}`}
                  placeholder="0.0"
                  step="0.0001"
                  min="0"
                />
                {formErrors.value && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.value}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Data (hex)
                </label>
                <input
                  type="text"
                  value={newTx.data}
                  onChange={(e) => {
                    setNewTx({ ...newTx, data: e.target.value });
                    setFormErrors(prev => ({ ...prev, data: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-md font-mono
                    focus:outline-none focus:ring-1 focus:ring-black
                    ${formErrors.data ? 'border-red-500' : ''}`}
                  placeholder="0x"
                />
                {formErrors.data && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.data}</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 dark:bg-gray-800/50 flex space-x-3">
              <button
                onClick={handlePropose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white 
                  dark:text-gray-900 rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-white
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-gray-900 
                    border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Confirm'
                )}
              </button>
              <button
                onClick={() => setIsProposing(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 
                  rounded-lg text-sm text-gray-900 dark:text-white hover:bg-gray-50 
                  dark:hover:bg-gray-700 transition-all duration-200 transform 
                  hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 