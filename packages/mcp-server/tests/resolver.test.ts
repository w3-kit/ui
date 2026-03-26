import { describe, it, expect } from 'vitest';
import { MetadataResolver } from '../src/resolver.js';
import { Metadata } from '../src/types.js';

const mockMetadata: Metadata = {
  version: '0.1.0',
  generatedAt: '2026-03-26T00:00:00Z',
  components: [
    {
      name: 'token-card',
      title: 'Token Card',
      description: 'Display card for tokens.',
      category: 'token',
      dependencies: ['lucide-react'],
      props: [{ name: 'token', type: 'Token', optional: false }],
      sourceFiles: [{ path: 'token-card.tsx', content: '// source' }],
      examples: { basic: '<TokenCard />', full: '<TokenCard token={...} />' },
    },
    {
      name: 'nft-card',
      title: 'NFT Card',
      description: 'NFT display card.',
      category: 'nft',
      dependencies: ['lucide-react'],
      props: [],
      sourceFiles: [],
      examples: { basic: '<NftCard />', full: '<NftCard nft={...} />' },
    },
  ],
  designTokens: {
    colors: { primary: 'blue' },
    spacing: {},
    typography: { fontSizes: {}, fontFamily: {}, letterSpacing: {} },
  },
  guidelines: [{ topic: 'spacing', content: 'Use 4/8px system' }],
  compositions: [],
};

describe('MetadataResolver', () => {
  it('lists all components', () => {
    const resolver = MetadataResolver.fromStatic(mockMetadata);
    const result = resolver.listComponents();
    expect(result).toHaveLength(2);
  });

  it('filters components by category', () => {
    const resolver = MetadataResolver.fromStatic(mockMetadata);
    const result = resolver.listComponents('token');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('token-card');
  });

  it('gets a single component by name', () => {
    const resolver = MetadataResolver.fromStatic(mockMetadata);
    const result = resolver.getComponent('token-card');
    expect(result).toBeDefined();
    expect(result!.title).toBe('Token Card');
    expect(result!.props).toHaveLength(1);
  });

  it('returns undefined for unknown component', () => {
    const resolver = MetadataResolver.fromStatic(mockMetadata);
    expect(resolver.getComponent('nonexistent')).toBeUndefined();
  });

  it('returns design tokens', () => {
    const resolver = MetadataResolver.fromStatic(mockMetadata);
    const tokens = resolver.getDesignTokens();
    expect(tokens.colors['primary']).toBe('blue');
  });

  it('returns design tokens filtered by section', () => {
    const resolver = MetadataResolver.fromStatic(mockMetadata);
    const tokens = resolver.getDesignTokens('colors');
    expect(tokens.colors['primary']).toBe('blue');
    expect(tokens.spacing).toEqual({});
  });

  it('returns guidelines by topic', () => {
    const resolver = MetadataResolver.fromStatic(mockMetadata);
    const guidelines = resolver.getGuidelines('spacing');
    expect(guidelines).toHaveLength(1);
    expect(guidelines[0].content).toContain('4/8px');
  });

  it('returns all guidelines when no topic specified', () => {
    const resolver = MetadataResolver.fromStatic(mockMetadata);
    const guidelines = resolver.getGuidelines();
    expect(guidelines).toHaveLength(1);
  });
});
