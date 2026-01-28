import { FunctionType } from './types';

// Default ERC20 functions for demo
export const DEFAULT_FUNCTIONS: FunctionType[] = [
  { name: 'balanceOf', inputs: 1, type: 'view', description: 'Get the token balance of an account' },
  { name: 'transfer', inputs: 2, type: 'write', description: 'Transfer tokens to another address' },
  { name: 'approve', inputs: 2, type: 'write', description: 'Approve an address to spend your tokens' },
  { name: 'allowance', inputs: 2, type: 'view', description: 'Check how many tokens an address can spend' },
  { name: 'totalSupply', inputs: 0, type: 'view', description: 'Get the total supply of tokens' },
  { name: 'name', inputs: 0, type: 'view', description: 'Get the name of the token' },
];

// Get function description
export const getFunctionDescription = (fn: FunctionType): string => {
  if (fn.description) return fn.description;

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

// Get result message for display
export const getResultMessage = (fn: string, result: string): string => {
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

// Validate Ethereum address
export const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Validate amount
export const validateAmount = (amount: string): boolean => {
  return !isNaN(Number(amount)) && Number(amount) > 0;
};

// Animation classes
export const fadeInAnimation = "animate-fadeIn";
export const slideInAnimation = "animate-slideIn";
export const buttonAnimation = "hover:scale-[1.02] active:scale-[0.98] transition-all duration-200";
