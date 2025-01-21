import React, { useState, useCallback } from 'react';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { ContractInteractionProps, ContractFunction, FunctionCallResult } from './types';
import { formatInputValue, parseInputValue, getInputType, categorizeFunction } from './utils';
import { Fragment } from '@ethersproject/abi';

export const ContractInteraction: React.FC<ContractInteractionProps> = ({
  abi,
  contractAddress,
  className = '',
  onSuccess,
  onError
}) => {
  const [selectedFunction, setSelectedFunction] = useState<ContractFunction | null>(null);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<FunctionCallResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'read' | 'write'>('read');

  const functions = abi.filter((item): item is Fragment & ContractFunction => 
    item.type === 'function'
  );

  const { readFunctions, writeFunctions } = categorizeFunction(functions);
  const displayFunctions = activeTab === 'read' ? readFunctions : writeFunctions;

  const handleInputChange = (name: string, value: string) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  const getContract = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('No Web3 Provider found');
    }

    const provider = new Web3Provider(window.ethereum as any);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    
    return new Contract(contractAddress, abi, signer);
  }, [abi, contractAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFunction) return;

    setLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const params = selectedFunction.inputs.map(input => 
        parseInputValue(inputValues[input.name], input.type)
      );

      let result;
      if (selectedFunction.stateMutability === 'view' || selectedFunction.stateMutability === 'pure') {
        result = await contract[selectedFunction.name](...params);
      } else {
        const tx = await contract[selectedFunction.name](...params);
        await tx.wait();
        result = tx.hash;
      }

      const callResult = {
        functionName: selectedFunction.name,
        result,
        timestamp: Date.now()
      };

      setResults(prev => [callResult, ...prev]);
      onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Contract Interaction</h2>
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-sm text-gray-500">Contract:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {contractAddress}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Function Type Tabs */}
      <div className="border-b">
        <div className="flex">
          {(['read', 'write'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedFunction(null);
                setInputValues({});
              }}
              className={`flex-1 px-3 py-2 text-sm transition-colors
                ${activeTab === tab 
                  ? 'border-b-2 border-black font-medium'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Functions
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Function Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {displayFunctions.map((fn) => (
            <button
              key={fn.name}
              onClick={() => {
                setSelectedFunction(fn);
                setInputValues({});
                setError(null);
              }}
              className={`p-3 text-left border rounded transition-colors
                ${selectedFunction?.name === fn.name
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="font-medium">{fn.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {fn.inputs.length} input(s) • {fn.stateMutability}
              </div>
            </button>
          ))}
        </div>

        {/* Function Inputs */}
        {selectedFunction && (
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{selectedFunction.name}</h3>
              <span className="text-xs text-gray-500">{selectedFunction.stateMutability}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedFunction.inputs.map((input) => (
                <div key={input.name} className="space-y-1">
                  <label className="text-sm font-medium">
                    {input.name}
                    <span className="text-gray-500 ml-1">({input.type})</span>
                  </label>
                  <input
                    type={getInputType(input.type)}
                    placeholder={`Enter ${input.type}`}
                    value={inputValues[input.name] || ''}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md
                      focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-black text-white rounded-md text-sm
                  hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Execute ${selectedFunction.name}`
                )}
              </button>
            </form>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 border border-red-200 rounded-lg bg-red-50 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium">Recent Results</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{result.functionName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600 font-mono break-all">
                  {formatInputValue(result.result)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 