import { Network } from "./types";

export async function switchNetwork(network: Network): Promise<void> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No crypto wallet found");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${network.chainId.toString(16)}` }],
    });
  } catch (switchError: unknown) {
    if (
      typeof switchError === "object" &&
      switchError &&
      "code" in switchError &&
      switchError.code === 4902
    ) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${network.chainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.symbol,
                symbol: network.symbol,
                decimals: 18,
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.blockExplorer],
            },
          ],
        });
      } catch {
        throw new Error("Failed to add network");
      }
    }
    throw new Error("Failed to switch network");
  }
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}
