import { ENSResult } from "./types";

export const isENS = (v: string) => v.toLowerCase().endsWith(".eth");
export const isAddress = (v: string) => /^0x[a-fA-F0-9]{40}$/.test(v);
export const truncateAddress = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

export const defaultResolver = async (input: string): Promise<ENSResult> => {
  await new Promise((r) => setTimeout(r, 1000));
  if (isENS(input)) {
    return {
      ensName: input,
      address:
        "0x" +
        Array(40)
          .fill(0)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join(""),
    };
  } else if (isAddress(input)) {
    return { address: input, ensName: `${input.slice(2, 8)}.eth` };
  }
  throw new Error("Enter a valid ENS name or Ethereum address");
};
