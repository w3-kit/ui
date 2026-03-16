import { ButtonVariant, WalletType, WalletConnectConfig } from './types';

// Variant styles for button appearance
export const variantStyles: Record<ButtonVariant, string> = {
  ghost: `
    bg-transparent hover:bg-accent
    text-foreground
    border-2 border-border
    hover:border-border
    shadow-sm hover:shadow
    transition-all duration-200
  `,
  light: `
    bg-card
    hover:bg-accent
    text-foreground
    border border-border
    hover:border-border
    shadow-sm hover:shadow
    transition-all duration-200
  `,
  dark: `
    bg-foreground
    hover:bg-foreground/90
    text-background
    border border-transparent
    shadow-md hover:shadow-sm
    transition-all duration-200
  `,
};

// Default WalletConnect configuration
export const DEFAULT_WALLETCONNECT_CONFIG: WalletConnectConfig = {
  rpc: {
    1: 'https://mainnet.infura.io/v3/YOUR_INFURA_ID',
    4: 'https://rinkeby.infura.io/v3/YOUR_INFURA_ID',
  },
  bridge: 'https://bridge.walletconnect.org',
};

// Wallet icon URLs
export const WALLET_ICONS = {
  metamask: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png',
  walletconnect: 'https://cdn-images-1.medium.com/max/1200/1*fgRGbOjhoJMHqh9czHETZQ.png',
  coinbase: 'https://cdn.iconscout.com/icon/free/png-256/free-coinbase-logo-icon-download-in-svg-png-gif-file-formats--web-crypro-trading-platform-logos-pack-icons-7651204.png',
};

// Get default label for wallet type
export const getDefaultLabel = (type: WalletType): string => {
  switch (type) {
    case 'metamask':
      return 'Connect MetaMask';
    case 'walletconnect':
      return 'WalletConnect';
    case 'coinbase':
      return 'Coinbase Wallet';
    case 'phantom':
      return 'Phantom Wallet';
    default:
      return 'Connect Wallet';
  }
};

// Animation classes
export const buttonAnimation = "transform hover:scale-[1.02] active:scale-[0.98]";
export const spinnerAnimation = "animate-spin h-5 w-5";
