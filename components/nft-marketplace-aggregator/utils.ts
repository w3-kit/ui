import { NFTListing } from "./types";

export function formatPrice(price: number, currency: string): string {
  return `${price.toFixed(3)} ${currency}`;
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export const MOCK_LISTINGS: NFTListing[] = [
  { id: "1", name: "Bored Ape #1234", image: "https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ", collection: "BAYC", marketplace: "OpenSea", price: 45.5, currency: "ETH", usdPrice: 81900, verified: true },
  { id: "2", name: "CryptoPunk #5678", image: "https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ", collection: "CryptoPunks", marketplace: "Blur", price: 62.0, currency: "ETH", usdPrice: 111600, verified: true },
  { id: "3", name: "Azuki #9012", image: "https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ", collection: "Azuki", marketplace: "LooksRare", price: 12.3, currency: "ETH", usdPrice: 22140, verified: true },
];
