import { BigNumber } from '@ethersproject/bignumber';
import { ContractFunction } from './types';
import { Fragment } from '@ethersproject/abi';

export function getInputType(abiType: string): string {
  if (abiType.includes('int')) return 'number';
  if (abiType === 'bool') return 'checkbox';
  return 'text';
}

export function parseInputValue(value: string, type: string): any {
  if (!value) return '';
  
  if (type.includes('int')) {
    return BigNumber.from(value);
  }
  if (type === 'bool') {
    return value === 'true';
  }
  if (type === 'address') {
    if (!value.match(/^0x[a-fA-F0-9]{40}$/)) {
      throw new Error('Invalid address format');
    }
    return value;
  }
  if (type.includes('[]')) {
    return JSON.parse(value);
  }
  return value;
}

export function formatInputValue(value: any): string {
  if (BigNumber.isBigNumber(value)) {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  return String(value);
}

export function categorizeFunction(functions: Fragment[]) {
  return functions.reduce(
    (acc, fn) => {
      const func = fn as ContractFunction;
      if (func.stateMutability === 'view' || func.stateMutability === 'pure') {
        acc.readFunctions.push(func);
      } else {
        acc.writeFunctions.push(func);
      }
      return acc;
    },
    { readFunctions: [] as ContractFunction[], writeFunctions: [] as ContractFunction[] }
  );
} 