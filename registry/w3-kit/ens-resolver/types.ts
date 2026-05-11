export interface ENSResult {
  address?: string;
  ensName?: string;
  avatar?: string;
}

export interface ENSResolverProps {
  onResolve?: (result: ENSResult) => void;
  resolver?: (input: string) => Promise<ENSResult>;
  /** Suggested ENS names shown in the idle state */
  suggestions?: string[];
  /** Block explorer base URL for the address external link (e.g. "https://etherscan.io/address/") */
  explorerUrl?: string;
  /** Footer caption shown when idle (defaults to "Enter a name or address") */
  idleCaption?: string;
  className?: string;
}
