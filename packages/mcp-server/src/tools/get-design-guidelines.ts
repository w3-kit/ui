import { MetadataResolver } from '../resolver.js';

export function handleGetDesignGuidelines(
  resolver: MetadataResolver,
  args: { topic?: string },
) {
  const guidelines = resolver.getGuidelines(args.topic);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(guidelines, null, 2) }],
  };
}
