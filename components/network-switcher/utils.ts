import { Network } from './types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function switchNetwork(network: Network): Promise<void> {
  if (!window.ethereum) {
    throw new Error('No crypto wallet found');
  }

  try {
    // Try switching to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${network.chainId.toString(16)}` }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
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
      } catch (addError) {
        throw new Error('Failed to add network');
      }
    } else {
      throw new Error('Failed to switch network');
    }
  }
} 