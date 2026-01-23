export const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }

  @keyframes slideDown {
    from { max-height: 0; opacity: 0; }
    to { max-height: 500px; opacity: 1; }
  }

  @keyframes slideUp {
    from { max-height: 500px; opacity: 1; }
    to { max-height: 0; opacity: 0; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .animate-slideDown {
    animation: slideDown 0.3s ease-out forwards;
    overflow: hidden;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-in forwards;
    overflow: hidden;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-bounce {
    animation: bounce 1s ease infinite;
  }

  .transition-height {
    transition: max-height 0.3s ease-out;
  }
`;

export const defaultTokens = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EescdeCB5Badce",
    decimals: 18,
    chainId: 1,
    logoURI:
      "https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png",
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    address: "0x4206931337dc273a630d328dA6441786bfaD668f",
    decimals: 8,
    chainId: 1,
    logoURI: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
  },
  {
    symbol: "BTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    chainId: 1,
    logoURI:
      "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  },
];

export function getMockExchangeRate(from: string, to: string): number {
  const rates: Record<string, Record<string, number>> = {
    ETH: {
      USDT: 1800.5,
      USDC: 1800.25,
      DAI: 1800.1,
      DOGE: 15000.75,
      BTC: 0.06,
    },
    BTC: {
      ETH: 16.67,
      USDT: 30000.5,
      USDC: 30000.25,
      DAI: 30000.1,
      DOGE: 250000.75,
    },
    USDT: { ETH: 0.00055, BTC: 0.000033, USDC: 1.0, DAI: 0.99, DOGE: 8.33 },
    USDC: { ETH: 0.00055, BTC: 0.000033, USDT: 1.0, DAI: 0.99, DOGE: 8.33 },
    DAI: { ETH: 0.00056, BTC: 0.000033, USDT: 1.01, USDC: 1.01, DOGE: 8.4 },
    DOGE: { ETH: 0.000067, BTC: 0.000004, USDT: 0.12, USDC: 0.12, DAI: 0.12 },
  };

  return rates[from]?.[to] || 1.0;
}
