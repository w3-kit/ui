"use client";

import React, { useState } from "react";
import { Wallet, Check, Loader2, Copy, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectWalletProps, WalletOption } from "./types";
import { truncateAddress, findWallet } from "./utils";

type WalletBucketKey = "evm" | "solana" | "both" | "other";

const BUCKET_ORDER: WalletBucketKey[] = ["evm", "solana", "both", "other"];

const BUCKET_LABELS: Record<WalletBucketKey, string> = {
  evm: "Ethereum",
  solana: "Solana",
  both: "Multi-chain",
  other: "Other wallets",
};

function WalletIcon({ wallet, size = 24 }: { wallet: WalletOption; size?: number }) {
  if (typeof wallet.icon === "string") {
    return (
      <img
        src={wallet.icon}
        alt={wallet.name}
        width={size}
        height={size}
        className="shrink-0 rounded-lg"
      />
    );
  }
  return <span className="shrink-0">{wallet.icon}</span>;
}

export function ConnectWallet({
  wallets,
  connectedAccount,
  onConnect,
  onDisconnect,
  chains,
  activeChain,
  onChainSwitch,
  recentWalletId,
  variant = "default",
  loading = false,
  className,
}: ConnectWalletProps) {
  const [chainsOpen, setChainsOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isConnected = !!connectedAccount;
  const connectedWallet = isConnected ? findWallet(wallets, connectedAccount.walletId) : undefined;
  const recentWallet = findWallet(wallets, recentWalletId);
  const groupedWallets = wallets.reduce<Record<WalletBucketKey, WalletOption[]>>(
    (acc, wallet) => {
      const bucket = wallet.ecosystem ?? "other";
      acc[bucket].push(wallet);
      return acc;
    },
    { evm: [], solana: [], both: [], other: [] },
  );
  const visibleBuckets = BUCKET_ORDER.filter((bucket) => groupedWallets[bucket].length > 0);
  const showBucketHeaders = visibleBuckets.length >= 2;

  const handleCopy = () => {
    if (connectedAccount?.address) {
      navigator.clipboard.writeText(connectedAccount.address).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWalletClick = (walletId: string) => {
    onConnect(walletId);
    setPickerOpen(false);
  };

  const renderWalletButton = (wallet: WalletOption, compact?: boolean) => (
    <button
      key={wallet.id}
      onClick={() => handleWalletClick(wallet.id)}
      disabled={loading}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        loading && "pointer-events-none opacity-40",
      )}
    >
      <WalletIcon wallet={wallet} size={compact ? 24 : 28} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {wallet.name}
          </span>
          {wallet.installed === false && (
            <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              Not installed
            </span>
          )}
        </div>
        {wallet.ecosystem && !compact && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {wallet.ecosystem === "evm"
              ? "Ethereum"
              : wallet.ecosystem === "solana"
                ? "Solana"
                : "Multi-chain"}
          </span>
        )}
      </div>
      <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
    </button>
  );

  const renderWalletGroups = (compact?: boolean) => {
    if (!showBucketHeaders) {
      return wallets.map((wallet) => renderWalletButton(wallet, compact));
    }

    return visibleBuckets.map((bucket, index) => (
      <div key={bucket} className="flex flex-col gap-0.5">
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500",
            index === 0 ? "mb-1 mt-1" : "mb-1 mt-3",
          )}
        >
          {BUCKET_LABELS[bucket]}
        </p>
        {groupedWallets[bucket].map((wallet) => renderWalletButton(wallet, compact))}
      </div>
    ));
  };

  /* ── Shared wallet list ──────────────────────────────────────────── */
  const renderWalletList = (opts?: { compact?: boolean }) => (
    <div className={cn("flex flex-col", opts?.compact ? "gap-0.5 p-2" : "gap-1 px-5 pb-5")}>
      {recentWallet && !isConnected && (
        <>
          <p className="mb-1 mt-1 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Recent
          </p>
          <button
            onClick={() => handleWalletClick(recentWallet.id)}
            disabled={loading}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border-2 border-gray-900/10 bg-gray-50 p-3 text-left transition-all",
              "hover:border-gray-900/20 dark:border-white/10 dark:bg-gray-800/50 dark:hover:border-white/20",
              loading && "pointer-events-none opacity-50",
            )}
          >
            <WalletIcon wallet={recentWallet} size={opts?.compact ? 24 : 28} />
            <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {recentWallet.name}
            </span>
            <span className="text-sm text-gray-400">→</span>
          </button>
          <p className="mb-1 mt-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            All Wallets
          </p>
        </>
      )}

      {renderWalletGroups(opts?.compact)}
    </div>
  );

  /* ── COMPACT VARIANT ─────────────────────────────────────────────── */
  if (variant === "compact") {
    if (isConnected && connectedWallet) {
      return (
        <div className={cn("relative", className)}>
          <button
            onClick={() => setPickerOpen(!pickerOpen)}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 transition-all",
              "hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600",
            )}
          >
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <WalletIcon wallet={connectedWallet} size={18} />
            <span className="font-mono text-xs font-medium text-gray-900 dark:text-gray-100">
              {truncateAddress(connectedAccount.address)}
            </span>
            {activeChain && (
              <span
                className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: (activeChain.color ?? "#888") + "14",
                  color: activeChain.color ?? "#888",
                }}
              >
                {activeChain.name}
              </span>
            )}
            <ChevronDown
              size={14}
              className={cn("text-gray-400 transition-transform", pickerOpen && "rotate-180")}
            />
          </button>

          {pickerOpen && (
            <div className="mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => {
                  onDisconnect?.();
                  setPickerOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={cn("relative", className)}>
        <button
          onClick={() => setPickerOpen(!pickerOpen)}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all",
            "hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
            loading && "pointer-events-none opacity-70",
          )}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
          {loading ? "Connecting..." : "Connect Wallet"}
          <ChevronDown
            size={14}
            className={cn("transition-transform", pickerOpen && "rotate-180")}
          />
        </button>

        {pickerOpen && (
          <div className="mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
            {renderWalletList({ compact: true })}
          </div>
        )}
      </div>
    );
  }

  /* ── DEFAULT VARIANT — full card picker ──────────────────────────── */
  if (isConnected && connectedWallet) {
    return (
      <div
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Connected
            </span>
          </div>
          {activeChain && (
            <span
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
              style={{
                background: (activeChain.color ?? "#888") + "14",
                color: activeChain.color ?? "#888",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: activeChain.color ?? "#888" }}
              />
              {activeChain.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-5">
          {/* Account */}
          <div className="flex items-center gap-3.5">
            <WalletIcon wallet={connectedWallet} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                {connectedWallet.name}
              </p>
              <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
                {truncateAddress(connectedAccount.address)}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex rounded-lg border border-gray-200 p-2 transition-colors",
                "hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
              )}
              aria-label="Copy address"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} className="text-gray-400" />
              )}
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Chain switcher */}
          {chains && chains.length > 0 && onChainSwitch && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Network
              </p>
              <button
                onClick={() => setChainsOpen(!chainsOpen)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border border-gray-200 px-3.5 py-2.5 transition-colors",
                  "hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activeChain && (
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: activeChain.color ?? "#888" }}
                    />
                  )}
                  {activeChain?.name ?? "Select chain"}
                </span>
                <ChevronDown
                  size={16}
                  className={cn("text-gray-400 transition-transform", chainsOpen && "rotate-180")}
                />
              </button>
              {chainsOpen && (
                <div className="mt-1.5 flex flex-col gap-0.5">
                  {chains.map((c) => (
                    <button
                      key={c.chainId}
                      onClick={() => {
                        onChainSwitch(c.chainId);
                        setChainsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
                        activeChain?.chainId === c.chainId
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50",
                      )}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: c.color ?? "#888" }}
                      />
                      {c.name}
                      {activeChain?.chainId === c.chainId && (
                        <Check size={14} className="ml-auto text-gray-900 dark:text-gray-100" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Disconnect */}
          {onDisconnect && (
            <button
              onClick={onDisconnect}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors",
                "hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
              )}
            >
              <LogOut size={16} />
              Disconnect
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── IDLE — wallet picker ────────────────────────────────────────── */
  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <Wallet size={18} className="text-gray-900 dark:text-gray-100" />
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Connect Wallet
        </span>
      </div>

      {renderWalletList()}

      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {wallets.length} wallet{wallets.length !== 1 ? "s" : ""} supported
        </span>
      </div>
    </div>
  );
}

export default ConnectWallet;
