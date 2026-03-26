import { describe, it, expect } from 'vitest';
import { extractInterfaces } from '../src/extractors/type-extractor.js';

describe('extractInterfaces', () => {
  it('extracts simple interface with required and optional props', () => {
    const source = `
export interface GasCalculatorProps {
  className?: string;
  onGasSelect?: (gas: number, price: number) => void;
  refreshInterval?: number;
  chainId?: number;
}`;
    const result = extractInterfaces(source);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('GasCalculatorProps');
    expect(result[0].props).toEqual([
      { name: 'className', type: 'string', optional: true },
      { name: 'onGasSelect', type: '(gas: number, price: number) => void', optional: true },
      { name: 'refreshInterval', type: 'number', optional: true },
      { name: 'chainId', type: 'number', optional: true },
    ]);
  });

  it('extracts interface with required props', () => {
    const source = `
export interface StakingInterfaceProps {
  pools: StakingPool[];
  userBalance?: string;
  onStake?: (poolId: string, amount: string) => void;
  className?: string;
}`;
    const result = extractInterfaces(source);
    const props = result.find(i => i.name === 'StakingInterfaceProps')!.props;
    expect(props[0]).toEqual({ name: 'pools', type: 'StakingPool[]', optional: false });
    expect(props[1]).toEqual({ name: 'userBalance', type: 'string', optional: true });
  });

  it('extracts multiple interfaces from one file', () => {
    const source = `
export interface GasPrice {
  low: number;
  medium: number;
  high: number;
}

export interface GasCalculatorProps {
  className?: string;
}`;
    const result = extractInterfaces(source);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('GasPrice');
    expect(result[1].name).toBe('GasCalculatorProps');
  });

  it('handles nested object types', () => {
    const source = `
export interface StakingPool {
  id: string;
  token: {
    symbol: string;
    logoURI: string;
    decimals: number;
  };
  apr: number;
}`;
    const result = extractInterfaces(source);
    expect(result[0].props).toContainEqual({
      name: 'id',
      type: 'string',
      optional: false,
    });
    expect(result[0].props.find(p => p.name === 'token')!.type).toContain('symbol');
  });

  it('handles inline comments', () => {
    const source = `
export interface StakingPool {
  lockPeriod: number; // in days
  totalStaked: string;
}`;
    const result = extractInterfaces(source);
    expect(result[0].props[0]).toEqual({
      name: 'lockPeriod',
      type: 'number',
      optional: false,
    });
  });

  it('returns empty array for source with no interfaces', () => {
    const source = `export type SortField = 'name' | 'balance';`;
    const result = extractInterfaces(source);
    expect(result).toEqual([]);
  });
});
