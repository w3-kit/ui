'use client';

import { useState, useCallback } from 'react';
import { ChevronRight, Code, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TabType,
  FunctionType,
  ResultType,
  ErrorState,
  ContractInteractionProps,
} from './types';
import {
  DEFAULT_FUNCTIONS,
  getFunctionDescription,
  getResultMessage,
  validateAddress,
  fadeInAnimation,
  slideInAnimation,
  buttonAnimation,
} from './utils';

// Error message component
const ErrorMessage = ({ error }: { error: ErrorState }) => (
  <div className={`
    mt-4 p-3 rounded-lg text-sm
    transition-all duration-300
    ${slideInAnimation}
    ${error.type === 'error'
      ? 'bg-destructive/10 text-destructive border border-destructive/20'
      : error.type === 'warning'
      ? 'bg-warning/10 text-warning border border-warning/20'
      : 'bg-primary/10 text-primary border border-primary/20'
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

export const ContractInteraction: React.FC<ContractInteractionProps> = ({
  className = '',
  contractAddress = '0x1234...5678',
  functions = DEFAULT_FUNCTIONS,
  onExecute,
  resultsPerPage = 6,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('read');
  const [selectedFunction, setSelectedFunction] = useState<FunctionType | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [results, setResults] = useState<ResultType[]>([]);
  const [selectedResult, setSelectedResult] = useState<ResultType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const filteredFunctions = functions.filter(fn =>
    activeTab === 'read' ? fn.type === 'view' : fn.type === 'write'
  );

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

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

      if (selectedFunction.inputs > 0 && !validateAddress(inputValue)) {
        throw {
          message: 'Invalid Ethereum address format',
          type: 'error',
          field: 'input'
        } as ErrorState;
      }

      setIsExecuting(true);

      let mockValue = '';

      if (onExecute) {
        // Use custom execute handler if provided
        mockValue = await onExecute(selectedFunction.name, inputValue ? [inputValue] : []);
      } else {
        // Simulate execution with mock data
        if (Math.random() < 0.2) {
          throw {
            message: 'Network error: Please try again',
            type: 'error'
          } as ErrorState;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

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
  }, [selectedFunction, inputValue, onExecute]);

  return (
    <Card className={`${fadeInAnimation} ${className}`}>
      {/* Header */}
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Contract Interaction</CardTitle>
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-sm text-muted-foreground">Contract:</span>
              <div className="group cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
                <code className="text-sm bg-muted px-2 py-1 rounded text-foreground
                  transition-colors duration-200
                  group-hover:bg-muted/80"
                >
                  {contractAddress}
                </code>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Interactive Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {(['read', 'write'] as TabType[]).map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              onClick={() => {
                setActiveTab(tab);
                setSelectedFunction(null);
                setInputValue('');
                setError(null);
              }}
              className={`
                flex-1 px-3 py-2 text-sm rounded-none
                transition-all duration-200
                active:scale-[0.98]
                ${activeTab === tab
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Functions
            </Button>
          ))}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Interactive Function Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {filteredFunctions.map((fn) => (
            <Button
              key={fn.name}
              variant="outline"
              onClick={() => {
                setSelectedFunction(fn);
                setError(null);
                setInputValue('');
              }}
              className={`
                p-3 text-left h-auto justify-start
                transition-all duration-300 ease-in-out
                ${buttonAnimation}
                hover:shadow-md
                ${fadeInAnimation}
                group
                ${selectedFunction?.name === fn.name
                  ? 'border-primary bg-muted'
                  : ''
                }
              `}
            >
              <div className="w-full">
                <div className="font-medium group-hover:text-primary transition-colors duration-200">
                  {fn.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1
                  group-hover:text-foreground/70 transition-colors duration-200">
                  {fn.inputs} input(s) • {fn.type}
                </div>
                <div className="text-xs text-muted-foreground mt-2
                  group-hover:text-foreground/60 transition-colors duration-200">
                  {getFunctionDescription(fn)}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Interactive Function Inputs */}
        {selectedFunction && (
          <Card className={`bg-muted ${slideInAnimation}`}>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{selectedFunction.name}</h3>
                <span className="text-xs text-muted-foreground">{selectedFunction.type}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedFunction.inputs > 0 && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      address
                      <span className="text-muted-foreground ml-1">(address)</span>
                    </label>
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter address"
                      className={error?.field === 'input' ? 'border-destructive' : ''}
                    />
                  </div>
                )}

                {error && <ErrorMessage error={error} />}

                <Button
                  type="submit"
                  disabled={isExecuting || !!error}
                  className="w-full"
                >
                  {isExecuting ? (
                    <>
                      <div className="animate-spin mr-2">
                        <Code className="w-4 h-4" />
                      </div>
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <span>Execute {selectedFunction.name}</span>
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {results.length > 0 && (
          <div className={`mt-6 space-y-3 ${slideInAnimation}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Recent Results</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  ←
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  →
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {paginatedResults.map((result) => (
                <Button
                  key={result.id}
                  variant="outline"
                  onClick={() => setSelectedResult(
                    selectedResult?.id === result.id ? null : result
                  )}
                  className={`
                    w-full p-3 h-auto
                    transition-all duration-200
                    text-left justify-start
                    group
                    ${selectedResult?.id === result.id ?
                      'border-primary ring-1 ring-primary' :
                      ''
                    }
                  `}
                >
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {result.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : result.status === 'pending' ? (
                          <div className="w-4 h-4">
                            <Code className="w-4 h-4 text-warning animate-spin" />
                          </div>
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span className="font-medium">{result.function.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {result.time}
                      </span>
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground font-mono break-all
                      transition-all duration-200 group-hover:text-foreground">
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
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                        {result.function.type === 'write' ? (
                          <>
                            <div key="hash">
                              <div className="text-xs text-muted-foreground">Hash</div>
                              <div className="font-mono truncate">{result.hash}</div>
                            </div>
                            <div key="from">
                              <div className="text-xs text-muted-foreground">From</div>
                              <div className="font-mono truncate">{result.from}</div>
                            </div>
                            <div key="to">
                              <div className="text-xs text-muted-foreground">To</div>
                              <div className="font-mono truncate">{result.to}</div>
                            </div>
                            <div key="gas">
                              <div className="text-xs text-muted-foreground">Gas Used</div>
                              <div className="font-mono">{result.gasUsed}</div>
                            </div>
                          </>
                        ) : null}
                        <div key="type">
                          <div className="text-xs text-muted-foreground">Type</div>
                          <div className="font-medium text-foreground">
                            {result.function.type === 'write' ? 'Transaction' : 'Read Call'}
                          </div>
                        </div>
                        <div key="status">
                          <div className="text-xs text-muted-foreground">Status</div>
                          <div className={`font-medium ${
                            result.status === 'success' ? 'text-success' :
                            result.status === 'pending' ? 'text-warning' :
                            'text-destructive'
                          }`}>
                            {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
