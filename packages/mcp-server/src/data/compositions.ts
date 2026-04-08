import { CompositionTemplate } from "../types.js";

export const COMPOSITIONS: CompositionTemplate[] = [
  {
    name: "token-dashboard",
    description: "A dashboard showing token prices, portfolio balance, and a token list",
    components: ["token-list", "price-ticker", "wallet-balance"],
    template: `import { TokenList } from '@/components/token-list';
import { PriceTicker } from '@/components/price-ticker';
import { WalletBalance } from '@/components/wallet-balance';

export default function TokenDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <div className="lg:col-span-2 space-y-4">
        <PriceTicker symbol="ETH" />
        <TokenList tokens={['ETH', 'USDC', 'WBTC', 'DAI']} showPrices showBalances />
      </div>
      <div>
        <WalletBalance address="0x..." />
      </div>
    </div>
  );
}`,
  },
  {
    name: "nft-gallery",
    description: "An NFT collection browser with wallet connection",
    components: ["nft-collection-grid", "nft-card", "connect-wallet"],
    template: `import { NftCollectionGrid } from '@/components/nft-collection-grid';
import { ConnectWallet } from '@/components/connect-wallet';

export default function NftGallery() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">My NFTs</h1>
        <ConnectWallet />
      </div>
      <NftCollectionGrid collectionAddress="0x..." />
    </div>
  );
}`,
  },
  {
    name: "defi-overview",
    description: "DeFi portfolio overview with staking and liquidity positions",
    components: ["asset-portfolio", "staking-interface", "liquidity-pool-stats"],
    template: `import { AssetPortfolio } from '@/components/asset-portfolio';
import { StakingInterface } from '@/components/staking-interface';
import { LiquidityPoolStats } from '@/components/liquidity-pool-stats';

export default function DefiOverview() {
  return (
    <div className="space-y-6 p-4">
      <AssetPortfolio address="0x..." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StakingInterface pools={[]} />
        <LiquidityPoolStats pools={[]} />
      </div>
    </div>
  );
}`,
  },
  {
    name: "swap-interface",
    description: "Token swap with gas estimation",
    components: ["token-swap", "gas-calculator", "token-card"],
    template: `import { TokenSwap } from '@/components/token-swap';
import { GasCalculator } from '@/components/gas-calculator';

export default function SwapInterface() {
  return (
    <div className="max-w-lg mx-auto space-y-4 p-4">
      <TokenSwap />
      <GasCalculator chainId={1} />
    </div>
  );
}`,
  },
  {
    name: "wallet-view",
    description: "Full wallet view with balance, transactions, and network switching",
    components: ["wallet-balance", "transaction-history", "network-switcher"],
    template: `import { WalletBalance } from '@/components/wallet-balance';
import { TransactionHistory } from '@/components/transaction-history';
import { NetworkSwitcher } from '@/components/network-switcher';

export default function WalletView() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <NetworkSwitcher />
      </div>
      <WalletBalance address="0x..." />
      <TransactionHistory address="0x..." />
    </div>
  );
}`,
  },
];
