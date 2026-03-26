import { MetadataResolver } from '../resolver.js';

export function handleGetComponent(resolver: MetadataResolver, args: { name: string }) {
  const component = resolver.getComponent(args.name);

  if (!component) {
    const available = resolver.listComponents().map((c) => c.name).join(', ');
    return {
      content: [{ type: 'text' as const, text: `Component '${args.name}' not found. Available: ${available}` }],
      isError: true,
    };
  }

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(component, null, 2) }],
  };
}
