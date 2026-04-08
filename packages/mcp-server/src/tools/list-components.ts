import { MetadataResolver } from "../resolver.js";

export function handleListComponents(resolver: MetadataResolver, args: { category?: string }) {
  const components = resolver.listComponents(args.category);
  const summary = components.map(({ name, title, description, category, dependencies }) => ({
    name,
    title,
    description,
    category,
    dependencies,
  }));

  return {
    content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }],
  };
}
