export interface ENSResult {
  address?: string;
  ensName?: string;
  avatar?: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  result: ENSResult;
  timestamp: number;
}

export interface ENSResolverProps {
  onResolve?: (result: ENSResult) => void;
  className?: string;
  variant?: 'default' | 'compact';
  resolver?: (input: string) => Promise<ENSResult>;
}
