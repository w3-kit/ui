import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyComponent(componentName: string) {
  const sourceDir = path.join(__dirname, 'components', componentName);
  const targetDir = path.join(process.cwd(), 'components', componentName);

  // Check if component exists
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Component ${componentName} not found`);
  }

  // Create components directory if it doesn't exist
  await fs.ensureDir(path.join(process.cwd(), 'components'));

  // Copy component files
  await fs.copy(sourceDir, targetDir);

  // Copy required templates
  await copyTemplates();

  // Check for dependencies and add them to package.json
  const dependencies = getDependencies(componentName);
  await addDependencies(dependencies);
}

async function copyTemplates() {
  const templatesDir = path.join(__dirname, 'templates');
  const targetDir = process.cwd();

  // Copy tsconfig.json if it doesn't exist
  const tsconfigPath = path.join(targetDir, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    await fs.copy(
      path.join(templatesDir, 'tsconfig.json'),
      tsconfigPath
    );
  }

  // Copy tailwind.config.js if it doesn't exist
  const tailwindPath = path.join(targetDir, 'tailwind.config.js');
  if (!fs.existsSync(tailwindPath)) {
    await fs.copy(
      path.join(templatesDir, 'tailwind.config.js'),
      tailwindPath
    );
  }
}

function getDependencies(componentName: string) {
  const commonDeps = {
    'lucide-react': '^0.284.0',
    'tailwindcss': '^3.3.0',
    'next-themes': '^0.4.4',
    'react': '^18.0.0',
    'react-dom': '^18.0.0'
  };

  const componentDeps: Record<string, Record<string, string>> = {
    'bridge': {},
    'connect-wallet': {},
    'contract-interaction': {
      'ethers': '^6.7.1'
    },
    'gas-calculator': {},
    'network-switcher': {},
    'nft-card': {},
    'price-ticker': {
      'chart.js': '^4.4.7',
      'react-chartjs-2': '^5.3.0'
    },
    'token-list': {},
    'token-swap': {}
  };

  return {
    ...commonDeps,
    ...componentDeps[componentName]
  };
}

async function addDependencies(dependencies: Record<string, string>) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found');
  }

  const packageJson = await fs.readJson(packageJsonPath);
  const currentDeps = packageJson.dependencies || {};

  // Add new dependencies
  packageJson.dependencies = {
    ...currentDeps,
    ...dependencies
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
} 