import { Fragment } from '@ethersproject/abi';

export interface ContractFunction {
  name: string;
  type: 'function';
  stateMutability: 'view' | 'pure' | 'nonpayable' | 'payable';
  inputs: {
    name: string;
    type: string;
    components?: any[];
  }[];
  outputs: {
    name: string;
    type: string;
    components?: any[];
  }[];
}

export interface ContractInteractionProps {
  abi: Fragment[];
  contractAddress: string;
  className?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export interface FunctionCallResult {
  functionName: string;
  result: any;
  error?: string;
  timestamp: number;
} 