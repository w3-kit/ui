import { useState, useCallback } from 'react';
import { ChevronRight, Code, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ContractInteractionProps {
  className?: string;
}

type TabType = 'read' | 'write';
type FunctionType = {
  name: string;
  inputs: number;
  type: 'view' | 'write';
};

interface ResultType {
  id: string;
  function: {
    name: string;
    type: 'view' | 'write';
  };
  result: string;
  time: string;
  hash: string;
  from: string;
  to: string;
  gasUsed: string;
  status: 'success' | 'pending' | 'failed';
}

interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  field?: string;
}

const FUNCTIONS: FunctionType[] = [
  { name: 'balanceOf', inputs: 1, type: 'view' },
  { name: 'transfer', inputs: 2, type: 'write' },
  { name: 'approve', inputs: 2, type: 'write' },
  { name: 'allowance', inputs: 2, type: 'view' },
  { name: 'totalSupply', inputs: 0, type: 'view' },
  { name: 'name', inputs: 0, type: 'view' },
];

const getFunctionDescription = (fn: FunctionType): string => {
  switch (fn.name) {
    case 'balanceOf':
      return 'Get the token balance of an account';
    case 'transfer':
      return 'Transfer tokens to another address';
    case 'approve':
      return 'Approve an address to spend your tokens';
    case 'allowance':
      return 'Check how many tokens an address can spend';
    case 'totalSupply':
      return 'Get the total supply of tokens';
    case 'name':
      return 'Get the name of the token';
    default:
      return 'Interact with contract function';
  }
};

const getResultMessage = (fn: string, result: string): string => {
  switch (fn) {
    case 'balanceOf':
      return `Balance: ${result} tokens`;
    case 'transfer':
      return `Successfully transferred ${result} tokens`;
    case 'approve':
      return `Successfully approved ${result} tokens`;
    case 'allowance':
      return `Allowance: ${result} tokens`;
    case 'totalSupply':
      return `Total Supply: ${result} tokens`;
    case 'name':
      return `Token Name: ${result}`;
    default:
      return result;
  }
};

export const ContractInteraction: React.FC<ContractInteractionProps> = ({
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('read');
  const [selectedFunction, setSelectedFunction] = useState<FunctionType | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [results, setResults] = useState<ResultType[]>([]);
  const [selectedResult, setSelectedResult] = useState<ResultType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const filteredFunctions = FUNCTIONS.filter(fn => 
    activeTab === 'read' ? fn.type === 'view' : fn.type === 'write'
  );

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const validateInput = (value: string, type: 'address' | 'amount'): boolean => {
    if (type === 'address') {
      return /^0x[a-fA-F0-9]{40}$/.test(value);
    }
    if (type === 'amount') {
      return !isNaN(Number(value)) && Number(value) > 0;
    }
    return true;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFunction) return;

    setError(null);

    try {
      if (selectedFunction.inputs > 0 && !inputValue) {
        throw {
          message: 'Input value is required',
          type: 'error',
          field: 'input'
        } as ErrorState;
      }

      if (selectedFunction.inputs > 0 && !validateInput(inputValue, 'address')) {
        throw {
          message: 'Invalid Ethereum address format',
          type: 'error',
          field: 'input'
        } as ErrorState;
      }

      setIsExecuting(true);

      if (Math.random() < 0.2) {
        throw {
          message: 'Network error: Please try again',
          type: 'error'
        } as ErrorState;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockValue = '';
      switch (selectedFunction.name) {
        case 'balanceOf':
          mockValue = (Math.random() * 1000).toFixed(2);
          break;
        case 'transfer':
          if (Number(inputValue) > 1000) {
            throw {
              message: 'Insufficient balance for transfer',
              type: 'error',
              field: 'input'
            } as ErrorState;
          }
          mockValue = inputValue || '100';
          break;
        case 'approve':
          mockValue = inputValue || '1000';
          break;
        case 'allowance':
          mockValue = (Math.random() * 500).toFixed(2);
          break;
        case 'totalSupply':
          mockValue = '1000000';
          break;
        case 'name':
          mockValue = 'Example Token';
          break;
        default:
          mockValue = '0';
      }

      const mockResult: ResultType = {
        id: `${Date.now()}-${selectedFunction.name}`,
        function: {
          name: selectedFunction.name,
          type: selectedFunction.type
        },
        result: mockValue,
        time: new Date().toLocaleTimeString(),
        hash: selectedFunction.type === 'write' ? '0x' + Math.random().toString(16).slice(2, 42) : '',
        from: selectedFunction.type === 'write' ? '0x' + Math.random().toString(16).slice(2, 42) : '',
        to: selectedFunction.type === 'write' ? '0x' + Math.random().toString(16).slice(2, 42) : '',
        gasUsed: selectedFunction.type === 'write' ? Math.floor(Math.random() * 100000).toString() : '0',
        status: selectedFunction.type === 'write' ? 
          (Math.random() > 0.1 ? 'success' : 'failed') : 
          'success'
      };

      if (mockResult.status === 'failed') {
        throw {
          message: 'Transaction failed: Out of gas',
          type: 'error'
        } as ErrorState;
      }

      setResults(prev => [mockResult, ...prev].slice(0, 18));
      setInputValue('');
      setCurrentPage(1);
    } catch (err) {
      const errorState = err as ErrorState;
      setError(errorState);
      
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsExecuting(false);
    }
  }, [selectedFunction, inputValue]);

  const ErrorMessage = ({ error }: { error: ErrorState }) => (
    <div className={`
      mt-4 p-3 rounded-lg text-sm
      transition-all duration-300
      animate-slideIn
      ${error.type === 'error' 
        ? 'bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800'
        : error.type === 'warning'
        ? 'bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
        : 'bg-blue-50 dark:bg-blue-900/10 text-blue-500 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
      }
    `}>
      <div className="flex items-center space-x-2">
        {error.type === 'error' ? (
          <XCircle className="w-4 h-4" />
        ) : error.type === 'warning' ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <Info className="w-4 h-4" />
        )}
        <span>{error.message}</span>
      </div>
    </div>
  );

  return (
    <div className={`
      bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 shadow-sm
      animate-fadeIn
      ${className}
    `}>
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Contract Interaction</h2>
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Contract:</span>
              <div className="group cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded dark:text-gray-300
                  transition-colors duration-200
                  group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                >
                  0x1234...5678
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="border-b dark:border-gray-800">
        <div className="flex">
          {(['read', 'write'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedFunction(null);
                setInputValue('');
                setError(null);
              }}
              className={`
                flex-1 px-3 py-2 text-sm
                transition-all duration-200
                hover:bg-gray-50 dark:hover:bg-gray-800/50
                active:scale-[0.98]
                ${activeTab === tab
                  ? 'border-b-2 border-black dark:border-white font-medium dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Functions
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Interactive Function Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {filteredFunctions.map((fn) => (
            <button
              key={fn.name}
              onClick={() => {
                setSelectedFunction(fn);
                setError(null);
                setInputValue('');
              }}
              className={`
                p-3 text-left border rounded
                transition-all duration-300 ease-in-out
                hover:scale-[1.02] active:scale-[0.98]
                hover:shadow-md
                animate-fadeIn
                dark:border-gray-700
                group
                ${selectedFunction?.name === fn.name
                  ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                  : 'border-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="font-medium dark:text-white group-hover:text-blue-600 
                dark:group-hover:text-blue-400 transition-colors duration-200">
                {fn.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 
                group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                {fn.inputs} input(s) • {fn.type}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 
                group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200">
                {getFunctionDescription(fn)}
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Function Inputs */}
        {selectedFunction && (
          <div className="
            space-y-4 border dark:border-gray-700 rounded-lg p-4 
            bg-gray-50 dark:bg-gray-800
            animate-slideIn
          ">
            <div className="flex items-center justify-between">
              <h3 className="font-medium dark:text-white">{selectedFunction.name}</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">{selectedFunction.type}</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedFunction.inputs > 0 && (
                <div className="space-y-1">
                  <label className="text-sm font-medium dark:text-gray-300">
                    address
                    <span className="text-gray-500 dark:text-gray-400 ml-1">(address)</span>
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter address"
                    className={`
                      w-full px-3 py-2 text-sm border rounded-md
                      focus:outline-none focus:ring-1
                      dark:bg-gray-900 dark:text-gray-300 
                      transition-all duration-200
                      ${error?.field === 'input'
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-700 focus:ring-black dark:focus:ring-white'
                      }
                    `}
                  />
                </div>
              )}

              {error && <ErrorMessage error={error} />}

              <button
                type="submit"
                disabled={isExecuting || !!error}
                className={`
                  w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm
                  transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  hover:bg-gray-800 dark:hover:bg-gray-100
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2
                `}
              >
                {isExecuting ? (
                  <>
                    <div className="animate-spin">
                      <Code className="w-4 h-4" />
                    </div>
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <span>Execute {selectedFunction.name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Results Display */}
        {results.length > 0 && (
          <div className="mt-6 space-y-3 animate-slideIn">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium dark:text-white">Recent Results</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 hover:scale-110 active:scale-95
                    w-8 h-8 flex items-center justify-center"
                >
                  ←
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 hover:scale-110 active:scale-95
                    w-8 h-8 flex items-center justify-center"
                >
                  →
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {paginatedResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => setSelectedResult(
                    selectedResult?.id === result.id ? null : result
                  )}
                  className={`
                    w-full p-3 border dark:border-gray-700 rounded-lg
                    hover:shadow-sm dark:bg-gray-800
                    transition-all duration-200
                    animate-slideInFromLeft
                    text-left
                    group
                    ${selectedResult?.id === result.id ? 
                      'border-black dark:border-white ring-1 ring-black dark:ring-white' : 
                      'hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : result.status === 'pending' ? (
                        <div className="w-4 h-4">
                          <Code className="w-4 h-4 text-yellow-500 animate-spin" />
                        </div>
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="font-medium dark:text-white">{result.function.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {result.time}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-mono break-all
                    transition-all duration-200 group-hover:text-gray-900 dark:group-hover:text-gray-300">
                    {getResultMessage(result.function.name, result.result)}
                  </div>

                  {/* Expanded Details */}
                  <div className={`
                    mt-2 space-y-1 text-sm
                    transition-all duration-300 ease-in-out
                    ${selectedResult?.id === result.id 
                      ? 'opacity-100 max-h-[200px]' 
                      : 'opacity-0 max-h-0 overflow-hidden'
                    }
                  `}>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t dark:border-gray-700">
                      {result.function.type === 'write' ? (
                        <>
                          <div key="hash">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Hash</div>
                            <div className="font-mono truncate">{result.hash}</div>
                          </div>
                          <div key="from">
                            <div className="text-xs text-gray-500 dark:text-gray-400">From</div>
                            <div className="font-mono truncate">{result.from}</div>
                          </div>
                          <div key="to">
                            <div className="text-xs text-gray-500 dark:text-gray-400">To</div>
                            <div className="font-mono truncate">{result.to}</div>
                          </div>
                          <div key="gas">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Gas Used</div>
                            <div className="font-mono">{result.gasUsed}</div>
                          </div>
                        </>
                      ) : null}
                      <div key="type">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Type</div>
                        <div className="font-medium text-gray-600 dark:text-gray-300">
                          {result.function.type === 'write' ? 'Transaction' : 'Read Call'}
                        </div>
                      </div>
                      <div key="status">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                        <div className={`font-medium ${
                          result.status === 'success' ? 'text-green-500' :
                          result.status === 'pending' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 