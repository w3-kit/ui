import { ContractFunction } from "./types";

export const DEFAULT_FUNCTIONS: ContractFunction[] = [
  { name: "balanceOf", inputs: 1, type: "view", description: "Get token balance of an account" },
  { name: "transfer", inputs: 2, type: "write", description: "Transfer tokens to address" },
  { name: "approve", inputs: 2, type: "write", description: "Approve address to spend tokens" },
  { name: "allowance", inputs: 2, type: "view", description: "Check spending allowance" },
  { name: "totalSupply", inputs: 0, type: "view", description: "Get total token supply" },
  { name: "name", inputs: 0, type: "view", description: "Get token name" },
];

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
