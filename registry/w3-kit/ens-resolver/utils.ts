import { ENSResult } from './types';

// Check if input is an ENS name
export const isENS = (value: string): boolean => value.toLowerCase().endsWith('.eth');

// Check if input is a valid Ethereum address
export const isAddress = (value: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(value);

// Get Etherscan URL for address or ENS
export const getEtherscanUrl = (value: string, type: 'address' | 'ens'): string => {
  const baseUrl = 'https://etherscan.io';
  return type === 'address'
    ? `${baseUrl}/address/${value}`
    : `${baseUrl}/enslookup-search?search=${value}`;
};

// Truncate address for display
export const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Default mock resolver for demo purposes
export const defaultResolver = async (input: string): Promise<ENSResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (isENS(input)) {
    return {
      ensName: input,
      address: '0x' + Array(40).fill(0).map(() =>
        Math.floor(Math.random() * 16).toString(16)
      ).join(''),
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${input}`
    };
  } else if (isAddress(input)) {
    return {
      address: input,
      ensName: `${input.slice(2, 8)}.eth`,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${input}`
    };
  } else {
    throw new Error('Please enter a valid ENS name or Ethereum address');
  }
};

// Animation constants
export const slideInAnimation = "animate-slideIn";
export const buttonAnimation = "transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]";
