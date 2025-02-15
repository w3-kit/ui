import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, Check, X, ExternalLink, Code, Copy } from 'lucide-react';

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
  onFunctionCall?: (functionName: string, inputs: any[]) => void;
}

export const SmartContractScanner: React.FC<SmartContractScannerProps> = ({
  className = '',
  variant = 'default',
  onScan,
  onFunctionCall
}) => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'functions' | 'code'>('overview');
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual contract scanning logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      onScan?.(address);
      
      // Mock contract data
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
        ]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan contract');
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

  if (variant === 'compact') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter contract address"
              className="w-full px-4 py-2 pl-10 text-sm border border-gray-200 dark:border-gray-700 
                rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>

          <button
            onClick={handleScan}
            disabled={!address || isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isLoading ? 'Scanning...' : 'Scan Contract'}
          </button>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
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
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter contract address"
              className="w-full px-4 py-3 pl-11 text-sm border border-gray-200 dark:border-gray-700 
                rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>

          <button
            onClick={handleScan}
            disabled={!address || isLoading}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isLoading ? 'Scanning Contract...' : 'Scan Contract'}
          </button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 
              rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {contractInfo && (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4 px-6">
              {(['overview', 'functions', 'code'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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
              <div className="relative">
                <div className="absolute right-2 top-2 flex space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(contractInfo.sourceCode!)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                      dark:hover:text-gray-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`https://etherscan.io/address/${contractInfo.address}#code`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                      dark:hover:text-gray-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-900 dark:text-white">
                    {contractInfo.sourceCode}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
