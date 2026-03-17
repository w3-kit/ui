import { SecurityCheck } from "./types";

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function getMockChecks(): SecurityCheck[] {
  return [
    { id: "1", name: "Ownership Renounced", status: "safe", description: "Contract ownership has been renounced" },
    { id: "2", name: "No Proxy Pattern", status: "safe", description: "No upgradeable proxy detected" },
    { id: "3", name: "Reentrancy Guard", status: "safe", description: "Protected against reentrancy attacks" },
    { id: "4", name: "Unlimited Minting", status: "warning", description: "Token has no max supply cap" },
    { id: "5", name: "External Calls", status: "danger", description: "Unvalidated external contract calls found" },
  ];
}
