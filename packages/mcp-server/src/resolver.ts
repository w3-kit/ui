import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Metadata,
  ComponentInfo,
  DesignTokens,
  GuidelineSection,
  CompositionTemplate,
} from './types.js';
import { extractRegistry } from './extractors/registry-extractor.js';
import { extractInterfaces } from './extractors/type-extractor.js';
import { extractTokensFromFile } from './extractors/token-extractor.js';
import { GUIDELINES } from './data/guidelines.js';
import { COMPOSITIONS } from './data/compositions.js';
import { getExample } from './data/examples.js';

export class MetadataResolver {
  private metadata: Metadata;

  private constructor(metadata: Metadata) {
    this.metadata = metadata;
  }

  static fromStatic(metadata: Metadata): MetadataResolver {
    return new MetadataResolver(metadata);
  }

  static fromStaticFile(): MetadataResolver {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const metadataPath = join(__dirname, 'metadata', 'metadata.json');
    const raw = readFileSync(metadataPath, 'utf-8');
    return new MetadataResolver(JSON.parse(raw));
  }

  static fromLive(uiRoot: string): MetadataResolver {
    const registryPath = join(uiRoot, 'registry.json');
    const registry = JSON.parse(readFileSync(registryPath, 'utf-8'));
    const entries = extractRegistry(registry);

    const components: ComponentInfo[] = entries.map((entry) => {
      const sourceFiles = entry.filePaths.map((fp) => ({
        path: fp,
        content: readFileSync(join(uiRoot, fp), 'utf-8'),
      }));

      const typesFile = sourceFiles.find((f) => f.path.endsWith('types.ts'));
      const props = typesFile
        ? extractInterfaces(typesFile.content).flatMap((i) => i.props)
        : [];

      const examples = getExample(entry.name) ?? { basic: '', full: '' };

      return {
        name: entry.name,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        dependencies: entry.dependencies,
        props,
        sourceFiles,
        examples,
      };
    });

    const tailwindPath = join(uiRoot, 'tailwind.config.js');
    const designTokens = existsSync(tailwindPath)
      ? extractTokensFromFile(tailwindPath)
      : { colors: {}, spacing: {}, typography: { fontSizes: {}, fontFamily: {}, letterSpacing: {} } };

    const metadata: Metadata = {
      version: JSON.parse(readFileSync(join(uiRoot, 'package.json'), 'utf-8')).version,
      generatedAt: new Date().toISOString(),
      components,
      designTokens,
      guidelines: GUIDELINES,
      compositions: COMPOSITIONS,
    };

    return new MetadataResolver(metadata);
  }

  static create(dev: boolean): MetadataResolver {
    if (dev) {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const uiRoot = join(__dirname, '..', '..', '..');
      const registryPath = join(uiRoot, 'registry.json');
      if (existsSync(registryPath)) {
        return MetadataResolver.fromLive(uiRoot);
      }
    }
    return MetadataResolver.fromStaticFile();
  }

  listComponents(category?: string): ComponentInfo[] {
    if (category) {
      return this.metadata.components.filter((c) => c.category === category);
    }
    return this.metadata.components;
  }

  getComponent(name: string): ComponentInfo | undefined {
    return this.metadata.components.find((c) => c.name === name);
  }

  getDesignTokens(section?: string): DesignTokens {
    const tokens = this.metadata.designTokens;
    if (!section || section === 'all') return tokens;

    const empty: DesignTokens = {
      colors: {},
      spacing: {},
      typography: { fontSizes: {}, fontFamily: {}, letterSpacing: {} },
    };

    if (section === 'colors') return { ...empty, colors: tokens.colors };
    if (section === 'spacing') return { ...empty, spacing: tokens.spacing };
    if (section === 'typography') return { ...empty, typography: tokens.typography };
    return tokens;
  }

  getGuidelines(topic?: string): GuidelineSection[] {
    if (!topic || topic === 'all') return this.metadata.guidelines;
    return this.metadata.guidelines.filter((g) => g.topic === topic);
  }

  getCompositions(): CompositionTemplate[] {
    return this.metadata.compositions;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }
}
