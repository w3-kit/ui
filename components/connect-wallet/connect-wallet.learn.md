# Connect Wallet — Learn

## What is wallet connection?

Wallet connection is how users authenticate in web3. Instead of email + password, users prove who they are by signing a message with their private key. No accounts to create, no passwords to remember — your wallet IS your identity.

When a user "connects" their wallet to a dApp, they're granting the dApp permission to:

- **See** their public address and token balances
- **Request** transaction signatures (the user must approve each one)

They are NOT giving the dApp access to their private key or permission to move funds without approval.

## How it works

### The connection flow

1. User clicks "Connect Wallet"
2. The dApp detects available wallets (MetaMask, Phantom, etc.) via browser APIs
3. User picks a wallet → the wallet extension opens a popup
4. User approves the connection → the dApp receives the user's public address
5. The dApp can now show the user's address, balances, and request signatures

### EVM vs Solana

|                    | EVM                                                              | Solana                                                   |
| ------------------ | ---------------------------------------------------------------- | -------------------------------------------------------- |
| **Standard**       | EIP-1193 (`window.ethereum`) + EIP-6963 (multi-wallet discovery) | Wallet Standard (`window.solana` or Wallet Standard API) |
| **Libraries**      | wagmi + RainbowKit, ConnectKit, Web3Modal                        | @solana/wallet-adapter-react                             |
| **Key wallet**     | MetaMask                                                         | Phantom                                                  |
| **Address format** | `0x` + 40 hex chars (e.g., `0x1234...abcd`)                      | Base58 string (e.g., `7nYB...3kPW`)                      |
| **Auth pattern**   | SIWE (Sign-In With Ethereum)                                     | SIWS (Sign-In With Solana)                               |

### What is EIP-6963?

Before EIP-6963 (2023), if you had multiple EVM wallets installed, they'd fight over `window.ethereum`. Only one would win. EIP-6963 introduced a discovery protocol — dApps can now detect ALL installed wallets and let the user choose. Modern wallet libraries (wagmi v2+, RainbowKit v2+) support this by default.

### What is SIWE?

Sign-In With Ethereum (EIP-4361) lets users authenticate to backends using their wallet. Instead of OAuth or passwords:

1. Backend generates a nonce
2. User signs a standardized message with their wallet
3. Backend verifies the signature
4. User is authenticated — no password needed

## Security considerations

- **Never ask users to sign messages they don't understand** — a malicious signature request can drain a wallet
- **Verify the domain** — SIWE messages include the domain to prevent phishing
- **Disconnect when done** — connected dApps can track your address and balances
- **Multiple wallets** — users may have different wallets for different purposes (hot wallet for daily use, hardware wallet for savings)

## How this component works

This component provides the wallet connection UI — the button, wallet selection modal, and connected state display. It handles:

- "Connect" button with wallet provider icons
- Wallet selection when multiple wallets are detected
- Connected state (shows address, avatar, disconnect option)
- Network mismatch warnings

The component is **presentation-only**. Connect it to your wallet provider (wagmi, solana wallet-adapter) via callback props.
