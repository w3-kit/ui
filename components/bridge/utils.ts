import { Network, BridgeToken } from "./types";

export const DEFAULT_NETWORKS: Network[] = [
  { id: 1, name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040" },
  { id: 137, name: "Polygon", icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=040" },
  { id: 56, name: "BSC", icon: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040" },
  { id: 43114, name: "Avalanche", icon: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=040" },
];

export const DEFAULT_TOKENS: BridgeToken[] = [
  { symbol: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040" },
  { symbol: "USDC", name: "USD Coin", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040" },
  { symbol: "USDT", name: "Tether", icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040" },
];
