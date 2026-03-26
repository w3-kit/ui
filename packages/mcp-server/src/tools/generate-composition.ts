import { MetadataResolver } from '../resolver.js';

export function handleGenerateComposition(
  resolver: MetadataResolver,
  args: { description: string; components?: string[] },
) {
  const compositions = resolver.getCompositions();

  const descLower = args.description.toLowerCase();
  const matched = compositions.find((c) => {
    const nameParts = c.name.split('-');
    return nameParts.every((part) => descLower.includes(part));
  });

  if (matched) {
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          code: matched.template,
          components_used: matched.components,
          explanation: `Matched template: ${matched.name} — ${matched.description}`,
        }, null, 2),
      }],
    };
  }

  const requestedComponents = args.components ?? [];
  const allComponents = resolver.listComponents();
  const validComponents = requestedComponents.filter((name) =>
    allComponents.some((c) => c.name === name),
  );

  const imports = validComponents
    .map((name) => {
      const pascalName = name
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
      return `import { ${pascalName} } from '@/components/${name}';`;
    })
    .join('\n');

  const jsx = validComponents
    .map((name) => {
      const pascalName = name
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
      return `        <${pascalName} />`;
    })
    .join('\n');

  const code = `${imports}

export default function CustomComposition() {
  return (
    <div className="space-y-4 p-4">
${jsx}
    </div>
  );
}`;

  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({
        code,
        components_used: validComponents,
        explanation: `No matching template found. Generated scaffold with ${validComponents.length} component(s). Fill in props based on your data.`,
      }, null, 2),
    }],
  };
}
