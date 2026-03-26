import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MetadataResolver } from '../src/resolver.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uiRoot = join(__dirname, '..', '..', '..');

console.log('Building metadata from:', uiRoot);

const resolver = MetadataResolver.fromLive(uiRoot);
const metadata = resolver.getMetadata();

const outputDir = join(__dirname, '..', 'src', 'metadata');
mkdirSync(outputDir, { recursive: true });

const outputPath = join(outputDir, 'metadata.json');
writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

console.log(`Metadata written to ${outputPath}`);
console.log(`  Components: ${metadata.components.length}`);
console.log(`  Compositions: ${metadata.compositions.length}`);
console.log(`  Guidelines: ${metadata.guidelines.length}`);
