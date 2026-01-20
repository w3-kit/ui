export interface Network {
  id: number;
  name: string;
  icon: string;
}

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
  decimals: number;
}

export interface BridgeWidgetProps {
  className?: string;
  networks?: Network[];
  tokens?: Token[];
  tokenFees?: Record<string, string>;
  estimatedTime?: string;
  onBridge?: (params: BridgeParams) => void | Promise<void>;
}

export interface BridgeParams {
  fromNetwork: Network;
  toNetwork: Network;
  token: Token;
  amount: string;
}
