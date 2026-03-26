import { MetadataResolver } from '../resolver.js';
import { getExample as getStaticExample } from '../data/examples.js';

export function handleGetExample(
  resolver: MetadataResolver,
  args: { name: string; variant?: string },
) {
  const component = resolver.getComponent(args.name);
  if (!component) {
    const available = resolver.listComponents().map((c) => c.name).join(', ');
    return {
      content: [{ type: 'text' as const, text: `Component '${args.name}' not found. Available: ${available}` }],
      isError: true,
    };
  }

  const staticExample = getStaticExample(args.name);
  const examples = staticExample ?? component.examples;
  const variant = args.variant === 'full' ? 'full' : 'basic';
  const code = examples[variant] || examples.basic;

  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({
        code,
        description: `${variant} usage example for ${component.title}`,
      }, null, 2),
    }],
  };
}
