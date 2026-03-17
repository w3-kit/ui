export interface Network {
  id: number;
  name: string;
  icon: string;
}

export interface BridgeToken {
  symbol: string;
  name: string;
  icon: string;
}

export interface BridgeWidgetProps {
  className?: string;
  networks?: Network[];
  tokens?: BridgeToken[];
  onBridge?: (params: { fromNetwork: Network; toNetwork: Network; token: BridgeToken; amount: string }) => void | Promise<void>;
}
