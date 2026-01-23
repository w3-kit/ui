export type TabType = 'read' | 'write';

export interface FunctionType {
  name: string;
  inputs: number;
  type: 'view' | 'write';
  description?: string;
}

export interface ResultType {
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

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  field?: string;
}

export interface ContractInteractionProps {
  className?: string;
  contractAddress?: string;
  functions?: FunctionType[];
  onExecute?: (functionName: string, inputs: string[]) => Promise<string>;
  resultsPerPage?: number;
}
