import React, { useState, useCallback } from 'react';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { ContractInteractionProps, ContractFunction, FunctionCallResult } from './types';
import { formatInputValue, parseInputValue, getInputType, categorizeFunction } from './utils';

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

  const functions = abi.filter(
    (item): item is ContractFunction => item.type === 'function'
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

    const provider = new Web3Provider(window.ethereum);
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
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="border-b border-gray-200">
        <div className="flex">
          {(['read', 'write'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedFunction(null);
                setInputValues({});
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium text-center transition-colors
                ${activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {tab === 'read' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                )}
                <span className="capitalize">{tab} Functions</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Function List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayFunctions.map((fn) => (
            <button
              key={fn.name}
              onClick={() => {
                setSelectedFunction(fn);
                setInputValues({});
                setError(null);
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md
                ${selectedFunction?.name === fn.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <h3 className="font-medium text-gray-900">{fn.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {fn.inputs.length} input(s) • {fn.stateMutability}
              </p>
            </button>
          ))}
        </div>

        {/* Function Inputs */}
        {selectedFunction && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedFunction.name}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedFunction.inputs.map((input) => (
                <div key={input.name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {input.name}
                    <span className="text-xs text-gray-500 ml-1">({input.type})</span>
                  </label>
                  <input
                    type={getInputType(input.type)}
                    placeholder={`Enter ${input.type}`}
                    value={inputValues[input.name] || ''}
                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm 
                      focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all
                  ${loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Results</h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {result.functionName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 break-all">
                        {formatInputValue(result.result)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 