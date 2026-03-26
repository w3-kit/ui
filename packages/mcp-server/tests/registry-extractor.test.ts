import { describe, it, expect } from 'vitest';
import { extractRegistry } from '../src/extractors/registry-extractor.js';

const sampleRegistry = {
  items: [
    {
      name: 'token-card',
      title: 'Token Card',
      description: 'Display card for cryptocurrency tokens.',
      dependencies: ['lucide-react'],
      files: [
        { path: 'registry/w3-kit/token-card/token-card.tsx' },
        { path: 'registry/w3-kit/token-card/types.ts' },
      ],
    },
    {
      name: 'nft-card',
      title: 'NFT Card',
      description: 'NFT display card.',
      dependencies: ['lucide-react'],
      files: [
        { path: 'registry/w3-kit/nft-card/nft-card.tsx' },
      ],
    },
  ],
};

describe('extractRegistry', () => {
  it('extracts component entries from registry JSON', () => {
    const result = extractRegistry(sampleRegistry);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('token-card');
    expect(result[0].title).toBe('Token Card');
    expect(result[0].description).toBe('Display card for cryptocurrency tokens.');
    expect(result[0].dependencies).toEqual(['lucide-react']);
    expect(result[0].filePaths).toEqual([
      'registry/w3-kit/token-card/token-card.tsx',
      'registry/w3-kit/token-card/types.ts',
    ]);
  });

  it('assigns category based on name prefix', () => {
    const result = extractRegistry(sampleRegistry);
    expect(result[0].category).toBe('token');
    expect(result[1].category).toBe('nft');
  });

  it('assigns "general" category for unrecognized prefixes', () => {
    const registry = {
      items: [
        {
          name: 'bridge',
          title: 'Bridge',
          description: 'Cross-chain bridge.',
          dependencies: [],
          files: [],
        },
      ],
    };
    const result = extractRegistry(registry);
    expect(result[0].category).toBe('general');
  });
});
