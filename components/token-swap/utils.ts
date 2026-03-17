import { Token } from "./types";

export const defaultTokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", decimals: 18, logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040" },
  { symbol: "USDT", name: "Tether USD", decimals: 6, logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040" },
  { symbol: "USDC", name: "USD Coin", decimals: 6, logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040" },
  { symbol: "DAI", name: "Dai", decimals: 18, logoURI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=040" },
  { symbol: "BTC", name: "Wrapped Bitcoin", decimals: 8, logoURI: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040" },
];

export function getMockExchangeRate(from: string, to: string): number {
  const rates: Record<string, Record<string, number>> = {
    ETH: { USDT: 1800.5, USDC: 1800.25, DAI: 1800.1, BTC: 0.06 },
    BTC: { ETH: 16.67, USDT: 30000.5, USDC: 30000.25, DAI: 30000.1 },
    USDT: { ETH: 0.00055, BTC: 0.000033, USDC: 1.0, DAI: 0.99 },
    USDC: { ETH: 0.00055, BTC: 0.000033, USDT: 1.0, DAI: 0.99 },
    DAI: { ETH: 0.00056, BTC: 0.000033, USDT: 1.01, USDC: 1.01 },
  };
  return rates[from]?.[to] || 1.0;
}
