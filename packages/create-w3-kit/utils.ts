import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyComponent(componentName: string) {
  // Source paths - components are in the package root
  const sourceComponentDir = path.join(__dirname, '..', 'components', componentName);
  const sourceTokensFile = path.join(__dirname, '..', 'config', 'tokens.ts');

  // Target paths - now inside src directory
  const targetComponentDir = path.join(process.cwd(), 'src', 'components', 'ui', componentName);
  const targetConfigDir = path.join(process.cwd(), 'src', 'config');
  const targetTokensFile = path.join(targetConfigDir, 'tokens.ts');

  // Check if component exists
  if (!fs.existsSync(sourceComponentDir)) {
    throw new Error(`Component ${componentName} not found`);
  }

  // Create necessary directories
  await fs.ensureDir(path.join(process.cwd(), 'src', 'components', 'ui'));
  await fs.ensureDir(targetConfigDir);

  // Copy component files
  await fs.copy(sourceComponentDir, targetComponentDir);

  // Copy tokens config if it doesn't exist
  if (!fs.existsSync(targetTokensFile)) {
    await fs.copy(sourceTokensFile, targetTokensFile);
  }

  // Check for dependencies and add them to package.json
  const dependencies = getDependencies(componentName);
  await addDependencies(dependencies);
}

function getDependencies(componentName: string) {
  const commonDeps = {
    'lucide-react': '^0.284.0',
    'tailwindcss': '^3.3.0',
    '@ethersproject/abi': '^5.7.0',
    '@ethersproject/bignumber': '^5.7.0',
    '@ethersproject/contracts': '^5.7.0',
    '@ethersproject/providers': '^5.7.2',
    '@metamask/providers': '^11.1.0',
    '@web3-react/core': '^8.2.3',
    '@web3-react/walletconnect-connector': '^6.2.13',
    'chart.js': '^4.4.7',
    'react-chartjs-2': '^5.3.0'
  };

  const componentDeps: Record<string, Record<string, string>> = {
    'nft-collection-grid': {
      'next': '^13.0.0'
    },
    'token-swap': {
      'next': '^13.0.0'
    },
    'price-ticker': {
      'next': '^13.0.0'
    },
    'nft-card': {
      'next': '^13.0.0'
    },
    'network-switcher': {
      '@metamask/providers': '^11.1.0'
    },
    'contract-interaction': {
      'ethers': '^6.7.1'
    }
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