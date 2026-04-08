export const CATEGORIES = ["token", "nft", "wallet", "defi", "utility", "general"] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  token: "Token display, trading, and management components",
  nft: "NFT display, collection, and marketplace components",
  wallet: "Wallet connection, balance, and transaction components",
  defi: "DeFi protocol interaction and portfolio components",
  utility: "Gas estimation, network switching, and contract tools",
  general: "Cross-cutting components like bridges and subscriptions",
};
