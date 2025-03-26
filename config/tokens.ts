export const TOKEN_CONFIGS = {
  ETH: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040',
    chainId: 1
  },
  BTC: {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    logoURI: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040',
    chainId: 1
  },
  USDT: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
    chainId: 1
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040',
    chainId: 1
  },
  BNB: {
    address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    symbol: 'BNB',
    name: 'Binance Coin',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=040',
    chainId: 56
  },
  XRP: {
    address: '0x...',
    symbol: 'XRP',
    name: 'XRP',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=040',
    chainId: 1
  },
  USDD: {
    address: '0x0C10bF8FcB7Bf5412187A595ab97a3609160b5c6',
    symbol: 'USDD',
    name: 'USDD',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/usdd-usdd-logo.svg?v=040',
    chainId: 1
  },
  ADA: {
    address: '0x...',
    symbol: 'ADA',
    name: 'Cardano',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=040',
    chainId: 1
  },
  DOGE: {
    address: '0x...',
    symbol: 'DOGE',
    name: 'Dogecoin',
    decimals: 8,
    logoURI: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=040',
    chainId: 1
  },
  MATIC: {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=040',
    chainId: 137
  },
  DAI: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    name: 'Dai',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=040',
    chainId: 1
  },
  DOT: {
    address: '0x...',
    symbol: 'DOT',
    name: 'Polkadot',
    decimals: 10,
    logoURI: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=040',
    chainId: 1
  },
  SHIB: {
    address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.svg?v=040',
    chainId: 1
  },
  TRX: {
    address: '0x...',
    symbol: 'TRX',
    name: 'TRON',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/tron-trx-logo.svg?v=040',
    chainId: 1
  },
  SOL: {
    address: '0x...',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=040',
    chainId: 1
  },
  AVAX: {
    address: '0x...',
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=040',
    chainId: 43114
  },
  UNI: {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=040',
    chainId: 1
  },
  LINK: {
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/chainlink-link-logo.svg?v=040',
    chainId: 1
  },
  FPI: {
    address: '0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E',
    symbol: 'FPI',
    name: 'Frax Price Index',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/frax-price-index-fpi-logo.svg?v=040',
    chainId: 1
  }
} as const;

export type TokenSymbol = keyof typeof TOKEN_CONFIGS; 