import { useState } from 'react';

interface ContractInteractionProps {
  className?: string;
}

type TabType = 'read' | 'write';
type FunctionType = {
  name: string;
  inputs: number;
  type: 'view' | 'write';
};

const FUNCTIONS: FunctionType[] = [
  { name: 'balanceOf', inputs: 1, type: 'view' },
  { name: 'transfer', inputs: 2, type: 'write' },
  { name: 'approve', inputs: 2, type: 'write' },
  { name: 'allowance', inputs: 2, type: 'view' },
  { name: 'totalSupply', inputs: 0, type: 'view' },
  { name: 'name', inputs: 0, type: 'view' },
];

export const ContractInteraction: React.FC<ContractInteractionProps> = ({
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('read');
  const [selectedFunction, setSelectedFunction] = useState<FunctionType | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [results, setResults] = useState<Array<{ function: string; result: string; time: string }>>([]);

  const filteredFunctions = FUNCTIONS.filter(fn => 
    activeTab === 'read' ? fn.type === 'view' : fn.type === 'write'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFunction) return;

    const mockResult = {
      function: selectedFunction.name,
      result: '1000000000000000000',
      time: new Date().toLocaleTimeString()
    };

    setResults(prev => [mockResult, ...prev]);
    setInputValue('');
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Contract Interaction</h2>
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Contract:</span>
              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded dark:text-gray-300">
                0x1234...5678
              </code>
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
              }}
              className={`flex-1 px-3 py-2 text-sm transition-colors
                ${activeTab === tab
                  ? 'border-b-2 border-black dark:border-white font-medium dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
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
              onClick={() => setSelectedFunction(fn)}
              className={`p-3 text-left border rounded transition-colors dark:border-gray-700
                ${selectedFunction?.name === fn.name
                  ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                  : 'border-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              <div className="font-medium dark:text-white">{fn.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {fn.inputs} input(s) • {fn.type}
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Function Inputs */}
        {selectedFunction && (
          <div className="space-y-4 border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
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
                    className="w-full px-3 py-2 text-sm border dark:border-gray-700 rounded-md
                      focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white
                      dark:bg-gray-900 dark:text-gray-300"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm
                  hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Execute {selectedFunction.name}
              </button>
            </form>
          </div>
        )}

        {/* Results Display */}
        {results.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium dark:text-white">Recent Results</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className="p-3 border dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow dark:bg-gray-800"
              >
                <div className="flex justify-between">
                  <span className="font-medium dark:text-white">{result.function}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {result.time}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-mono break-all">
                  {result.result}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 