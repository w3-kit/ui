export interface Network {
  chainId: number;
  name: string;
  symbol: string;
  currency: string;
  rpcUrl: string;
  blockExplorer: string;
  logoURI: string;
}

export interface NetworkSwitcherProps {
  networks: Network[];
  testNetworks: Network[];
  onSwitch: (chainId: number) => void;
  className?: string;
}
