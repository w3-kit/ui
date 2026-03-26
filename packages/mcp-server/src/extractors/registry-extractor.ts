const CATEGORY_PREFIXES: Record<string, string> = {
  token: 'token',
  nft: 'nft',
  wallet: 'wallet',
  defi: 'defi',
  staking: 'defi',
  liquidity: 'defi',
  flash: 'defi',
  limit: 'defi',
  gas: 'utility',
  network: 'utility',
  ens: 'utility',
  smart: 'utility',
  contract: 'utility',
  connect: 'wallet',
  multisig: 'wallet',
  address: 'wallet',
  transaction: 'wallet',
  asset: 'defi',
  subscription: 'defi',
  price: 'token',
};

export interface RegistryEntry {
  name: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  filePaths: string[];
}

export function extractRegistry(registry: {
  items: Array<{
    name: string;
    title: string;
    description: string;
    dependencies?: string[];
    files?: Array<{ path: string }>;
  }>;
}): RegistryEntry[] {
  return registry.items.map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    category: categorize(item.name),
    dependencies: item.dependencies ?? [],
    filePaths: (item.files ?? []).map((f) => f.path),
  }));
}

function categorize(name: string): string {
  const firstWord = name.split('-')[0];
  return CATEGORY_PREFIXES[firstWord] ?? 'general';
}
