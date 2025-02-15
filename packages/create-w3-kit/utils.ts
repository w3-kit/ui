import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyComponent(componentName: string) {
  const sourceDir = path.join(__dirname, '..', '..', 'components', componentName);
  const targetDir = path.join(process.cwd(), 'components', componentName);

  // Check if component exists
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Component ${componentName} not found`);
  }

  // Create components directory if it doesn't exist
  await fs.ensureDir(path.join(process.cwd(), 'components'));

  // Copy component files
  await fs.copy(sourceDir, targetDir);

  // Check for dependencies and add them to package.json
  const dependencies = getDependencies(componentName);
  await addDependencies(dependencies);
}

function getDependencies(componentName: string) {
  const commonDeps = {
    'lucide-react': '^0.284.0',
    'tailwindcss': '^3.3.0',
  };

  const componentDeps: Record<string, Record<string, string>> = {
    'bridge': {},
    'connect-wallet': {
      '@metamask/providers': '^11.1.0',
      '@web3-react/walletconnect-connector': '^6.2.13'
    },
    'contract-interaction': {
      'ethers': '^6.7.1'
    },
    'gas-calculator': {},
    'network-switcher': {
      '@metamask/providers': '^11.1.0'
    },
    'nft-card': {
      'next': '^13.0.0'
    },
    'price-ticker': {
      'next': '^13.0.0'
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