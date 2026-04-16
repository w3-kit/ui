import { NFTListing } from "./types";

export function findBestPriceListing(listings: NFTListing[]): NFTListing | null {
  if (listings.length === 0) return null;

  return listings.reduce((best, listing) => {
    const bestNum = parseFloat(best.price);
    const currentNum = parseFloat(listing.price);
    if (isNaN(currentNum)) return best;
    if (isNaN(bestNum)) return listing;
    return currentNum < bestNum ? listing : best;
  }, listings[0]);
}
