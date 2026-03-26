import { MetadataResolver } from '../resolver.js';

export function handleGetDesignTokens(
  resolver: MetadataResolver,
  args: { section?: string },
) {
  const tokens = resolver.getDesignTokens(args.section);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(tokens, null, 2) }],
  };
}
