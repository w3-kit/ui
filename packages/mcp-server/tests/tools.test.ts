import { describe, it, expect, beforeAll } from 'vitest';
import { MetadataResolver } from '../src/resolver.js';
import { handleListComponents } from '../src/tools/list-components.js';
import { handleGetComponent } from '../src/tools/get-component.js';
import { handleGetDesignTokens } from '../src/tools/get-design-tokens.js';
import { handleGetDesignGuidelines } from '../src/tools/get-design-guidelines.js';
import { handleGenerateComposition } from '../src/tools/generate-composition.js';
import { handleGetExample } from '../src/tools/get-example.js';
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
      sourceFiles: [{ path: 'token-card.tsx', content: 'export const TokenCard = () => {}' }],
      examples: { basic: '<TokenCard />', full: '<TokenCard token={...} />' },
    },
  ],
  designTokens: {
    colors: { primary: 'blue' },
    spacing: { '4': '1rem' },
    typography: { fontSizes: { sm: '0.875rem' }, fontFamily: {}, letterSpacing: {} },
  },
  guidelines: [{ topic: 'spacing', content: 'Use 4/8px system' }],
  compositions: [
    {
      name: 'token-dashboard',
      description: 'Token dashboard',
      components: ['token-list', 'price-ticker', 'wallet-balance'],
      template: '<TokenDashboard />',
    },
  ],
};

let resolver: MetadataResolver;

beforeAll(() => {
  resolver = MetadataResolver.fromStatic(mockMetadata);
});

describe('list_components', () => {
  it('returns all components', () => {
    const result = handleListComponents(resolver, {});
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('token-card');
  });

  it('filters by category', () => {
    const result = handleListComponents(resolver, { category: 'nft' });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed).toHaveLength(0);
  });
});

describe('get_component', () => {
  it('returns component details', () => {
    const result = handleGetComponent(resolver, { name: 'token-card' });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.name).toBe('token-card');
    expect(parsed.props).toHaveLength(1);
    expect(parsed.sourceFiles).toHaveLength(1);
  });

  it('returns error for unknown component', () => {
    const result = handleGetComponent(resolver, { name: 'nonexistent' });
    expect(result.isError).toBe(true);
  });
});

describe('get_design_tokens', () => {
  it('returns all tokens', () => {
    const result = handleGetDesignTokens(resolver, {});
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.colors.primary).toBe('blue');
    expect(parsed.spacing['4']).toBe('1rem');
  });
});

describe('get_design_guidelines', () => {
  it('returns guidelines by topic', () => {
    const result = handleGetDesignGuidelines(resolver, { topic: 'spacing' });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].content).toContain('4/8px');
  });
});

describe('generate_composition', () => {
  it('matches a known template', () => {
    const result = handleGenerateComposition(resolver, { description: 'token dashboard' });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.components_used).toContain('token-list');
    expect(parsed.code).toBeDefined();
  });

  it('returns scaffold for unknown description', () => {
    const result = handleGenerateComposition(resolver, {
      description: 'something custom',
      components: ['token-card'],
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.components_used).toContain('token-card');
  });
});

describe('get_example', () => {
  it('returns basic example', () => {
    const result = handleGetExample(resolver, { name: 'token-card', variant: 'basic' });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.code).toContain('TokenCard');
  });

  it('returns error for unknown component', () => {
    const result = handleGetExample(resolver, { name: 'nonexistent' });
    expect(result.isError).toBe(true);
  });
});
