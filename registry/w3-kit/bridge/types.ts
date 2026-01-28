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
  onBridge?: (params: {
    fromNetwork: Network;
    toNetwork: Network;
    token: Token;
    amount: string;
  }) => Promise<void>;
}
