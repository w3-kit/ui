export interface ENSResult {
  address?: string;
  ensName?: string;
  avatar?: string;
}

export interface ENSResolverProps {
  onResolve?: (result: ENSResult) => void;
  className?: string;
  resolver?: (input: string) => Promise<ENSResult>;
}
