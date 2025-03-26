import React, { useState, useRef } from 'react';
import { Search, Shield, AlertTriangle, Check, X, ExternalLink, Copy, ChevronDown, ChevronUp } from 'lucide-react';

// Define error types for better error handling
export enum ContractError {
  INVALID_ADDRESS = 'Invalid contract address format',
  NOT_FOUND = 'Contract not found',
  NOT_VERIFIED = 'Contract is not verified',
  NETWORK_ERROR = 'Network connection error',
  SCAN_FAILED = 'Contract scanning failed',
  RATE_LIMIT = 'API rate limit exceeded',
  TIMEOUT = 'Request timeout',
  UNKNOWN = 'An unknown error occurred'
}

interface SecurityCheck {
  id: string;
  name: string;
  status: 'safe' | 'warning' | 'danger';
  description: string;
  details?: string;
}

interface ContractFunction {
  name: string;
  type: 'read' | 'write';
  inputs: { name: string; type: string }[];
  outputs: { type: string }[];
  stateMutability: string;
}

interface ContractInfo {
  name: string;
  address: string;
  network: string;
  verified: boolean;
  license: string;
  compiler: string;
  securityScore: number;
  checks: SecurityCheck[];
  functions: ContractFunction[];
  sourceCode?: string;
}

interface SmartContractScannerProps {
  className?: string;
  variant?: 'default' | 'compact';
  onScan?: (address: string) => void;
  onError?: (error: ContractError) => void; // Add error callback
}

export const SmartContractScanner: React.FC<SmartContractScannerProps> = ({
  className = '',
  variant = 'default',
  onScan,
  onError
}) => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'functions' | 'code'>('overview');
  const [error, setError] = useState<ContractError | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const codePreviewRef = useRef<HTMLDivElement>(null);

  // Validate Ethereum address format
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Handle address input change with validation
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    
    // Clear errors when input changes
    setValidationError(null);
    setError(null);
    
    // Validate address format if not empty
    if (value && !isValidAddress(value)) {
      setValidationError('Please enter a valid Ethereum address (0x followed by 40 hex characters)');
    }
  };

  const handleScan = async () => {
    if (!address) return;
    
    // Validate address before scanning
    if (!isValidAddress(address)) {
      const errorMsg = ContractError.INVALID_ADDRESS;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setValidationError(null);
    
    try {
      // Mock API call - replace with actual contract scanning logic
      await new Promise((resolve, reject) => {
        // Simulate random failures for testing (20% chance)
        const shouldFail = Math.random() < 0.2;
        
        setTimeout(() => {
          if (shouldFail) {
            reject(new Error('SCAN_FAILED'));
          } else {
            resolve(true);
          }
        }, 1500);
      });
      
      onScan?.(address);
      
      // Mock contract data with source code
      setContractInfo({
        name: 'Example Token',
        address: address,
        network: 'Ethereum Mainnet',
        verified: true,
        license: 'MIT',
        compiler: 'v0.8.17+commit.8df45f5f',
        securityScore: 85,
        checks: [
          {
            id: '1',
            name: 'Reentrancy Guard',
            status: 'safe',
            description: 'Contract is protected against reentrancy attacks'
          },
          {
            id: '2',
            name: 'Access Control',
            status: 'warning',
            description: 'Owner has significant privileges'
          }
        ],
        functions: [
          {
            name: 'balanceOf',
            type: 'read',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ type: 'uint256' }],
            stateMutability: 'view'
          },
          {
            name: 'transfer',
            type: 'write',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ type: 'bool' }],
            stateMutability: 'nonpayable'
          }
        ],
        // Add sample source code
        sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Example Token
 * @dev A simple ERC20 token with additional security features
 */
contract ExampleToken is ERC20, Ownable, ReentrancyGuard {
    uint256 private _maxSupply;
    mapping(address => bool) private _blacklisted;
    
    event AddressBlacklisted(address indexed account);
    event AddressUnblacklisted(address indexed account);
    
    constructor() ERC20("Example Token", "EXT") {
        _maxSupply = 1000000000 * 10**decimals();
        _mint(msg.sender, 100000000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= _maxSupply, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function blacklistAddress(address account) external onlyOwner {
        _blacklisted[account] = true;
        emit AddressBlacklisted(account);
    }
    
    function unblacklistAddress(address account) external onlyOwner {
        _blacklisted[account] = false;
        emit AddressUnblacklisted(account);
    }
    
    function isBlacklisted(address account) external view returns (bool) {
        return _blacklisted[account];
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override nonReentrant {
        require(!_blacklisted[from] && !_blacklisted[to], "Blacklisted address");
        super._beforeTokenTransfer(from, to, amount);
    }
}`
      });
    } catch (err) {
      // Map error messages to specific error types
      let errorType = ContractError.UNKNOWN;
      
      if (err instanceof Error) {
        switch (err.message) {
          case 'NOT_FOUND':
            errorType = ContractError.NOT_FOUND;
            break;
          case 'NOT_VERIFIED':
            errorType = ContractError.NOT_VERIFIED;
            break;
          case 'NETWORK_ERROR':
            errorType = ContractError.NETWORK_ERROR;
            break;
          case 'SCAN_FAILED':
            errorType = ContractError.SCAN_FAILED;
            break;
          case 'RATE_LIMIT':
            errorType = ContractError.RATE_LIMIT;
            break;
          case 'TIMEOUT':
            errorType = ContractError.TIMEOUT;
            break;
        }
      }
      
      setError(errorType);
      onError?.(errorType);
      setContractInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'safe': return 'text-green-500 dark:text-green-400';
      case 'warning': return 'text-yellow-500 dark:text-yellow-400';
      case 'danger': return 'text-red-500 dark:text-red-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };

  // Enhanced copy to clipboard with success feedback
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Function to get a preview of the source code
  const getCodePreview = (sourceCode: string, maxLines = 15): string => {
    const lines = sourceCode.split('\n');
    if (lines.length <= maxLines) return sourceCode;
    
    return lines.slice(0, maxLines).join('\n') + '\n...';
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter contract address"
              className={`w-full px-4 py-2 pl-10 text-sm border ${
                validationError ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              disabled={isLoading}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>

          {validationError && (
            <p className="text-sm text-red-500 dark:text-red-400">{validationError}</p>
          )}

          <button
            onClick={handleScan}
            disabled={!address || isLoading || !!validationError}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Scanning...</span>
              </div>
            ) : (
              'Scan Contract'
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {contractInfo && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Security Score
                </span>
                <span className={`text-sm font-medium ${
                  contractInfo.securityScore >= 80 ? 'text-green-500' :
                  contractInfo.securityScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {contractInfo.securityScore}/100
                </span>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {contractInfo.checks.length} security checks completed
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Smart Contract Scanner
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter contract address"
              className={`w-full px-4 py-3 pl-11 text-sm border ${
                validationError ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              disabled={isLoading}
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>

          {validationError && (
            <p className="text-sm text-red-500 dark:text-red-400">{validationError}</p>
          )}

          <button
            onClick={handleScan}
            disabled={!address || isLoading || !!validationError}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Scanning Contract...</span>
              </div>
            ) : (
              'Scan Contract'
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 
              rounded-lg flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h4>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {contractInfo && (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4 px-6 overflow-x-auto">
              {(['overview', 'functions', 'code'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Contract Name
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {contractInfo.name}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Contract Address
                      </h3>
                      <div className="mt-1 flex items-center">
                        <p className="text-sm text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
                          {contractInfo.address}
                        </p>
                        <button 
                          onClick={() => copyToClipboard(contractInfo.address)}
                          className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                            dark:hover:text-gray-200 transition-colors"
                          title="Copy address"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Network
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {contractInfo.network}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Compiler Version
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {contractInfo.compiler}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Security Score
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span className={`text-2xl font-bold ${
                          contractInfo.securityScore >= 80 ? 'text-green-500' :
                          contractInfo.securityScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {contractInfo.securityScore}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/100</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Verification Status
                      </h3>
                      <div className="mt-1 flex items-center">
                        {contractInfo.verified ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {contractInfo.verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Security Checks
                  </h3>
                  <div className="space-y-3">
                    {contractInfo.checks.map((check) => (
                      <div
                        key={check.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {check.status === 'safe' && (
                                <Shield className={`w-4 h-4 ${getStatusColor(check.status)}`} />
                              )}
                              {check.status === 'warning' && (
                                <AlertTriangle className={`w-4 h-4 ${getStatusColor(check.status)}`} />
                              )}
                              {check.status === 'danger' && (
                                <AlertTriangle className={`w-4 h-4 ${getStatusColor(check.status)}`} />
                              )}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {check.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {check.description}
                            </p>
                          </div>
                          <span className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                            {check.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'functions' && (
              <div className="space-y-4">
                {contractInfo.functions.map((func, index) => (
                  <div
                    key={`${func.name}-${index}`}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          func.type === 'read'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {func.type.toUpperCase()}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {func.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {func.stateMutability}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {func.inputs.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Inputs:</span>
                          <div className="mt-1 space-y-1">
                            {func.inputs.map((input, i) => (
                              <div
                                key={`${input.name}-${i}`}
                                className="text-sm text-gray-900 dark:text-white"
                              >
                                {input.name}: {input.type}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Returns:</span>
                        <div className="mt-1 text-sm text-gray-900 dark:text-white">
                          {func.outputs.map(output => output.type).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'code' && contractInfo.sourceCode && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Contract Address
                    </h3>
                    <div className="mt-1 flex items-center">
                      <p className="text-sm text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                        {contractInfo.address}
                      </p>
                      <button 
                        onClick={() => copyToClipboard(contractInfo.address)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                          dark:hover:text-gray-200 transition-colors"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(contractInfo.sourceCode!)}
                      className={`px-3 py-1.5 text-xs font-medium ${
                        copySuccess 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      } rounded-md transition-colors flex items-center`}
                      title="Copy source code"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Copy Code
                        </>
                      )}
                    </button>
                    <a
                      href={`https://etherscan.io/address/${contractInfo.address}#code`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 
                        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                        rounded-md transition-colors flex items-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      View on Etherscan
                    </a>
                  </div>
                </div>
                
                {/* Code preview with show more button */}
                <div className="relative">
                  <div 
                    ref={codePreviewRef}
                    className={`p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm ${
                      !expandedCode ? 'max-h-[300px] overflow-y-hidden' : 'max-h-[800px] overflow-y-auto'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap break-all">
                      <code className="text-gray-900 dark:text-white font-mono">
                        {expandedCode ? contractInfo.sourceCode : getCodePreview(contractInfo.sourceCode!, 15)}
                      </code>
                    </pre>
                  </div>
                  
                  {/* Gradient overlay for collapsed view */}
                  {!expandedCode && contractInfo.sourceCode!.split('\n').length > 15 && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none"></div>
                  )}
                  
                  {/* Show more/less button */}
                  {contractInfo.sourceCode!.split('\n').length > 15 && (
                    <button
                      onClick={() => setExpandedCode(!expandedCode)}
                      className="mt-2 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                        rounded-md transition-colors"
                    >
                      {expandedCode ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Show More ({contractInfo.sourceCode!.split('\n').length - 15} more lines)
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Contract metadata */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">License</h4>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">{contractInfo.license}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Compiler</h4>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">{contractInfo.compiler}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Verification</h4>
                      <p className="mt-1 text-gray-600 dark:text-gray-400 flex items-center">
                        {contractInfo.verified ? (
                          <>
                            <Check className="w-4 h-4 text-green-500 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-red-500 mr-1" />
                            Unverified
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
