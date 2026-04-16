"use client";

import React, { useState } from "react";
import { Globe, ArrowRightLeft, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BridgeWidgetProps, BridgeNetwork, BridgeToken } from "./types";

function NetIcon({ net, size = 20 }: { net: BridgeNetwork; size?: number }) {
  return net.icon ? (
    <img src={net.icon} alt={net.name} width={size} height={size} className="shrink-0 rounded-full" />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ width: size, height: size, background: net.color ?? "#888" }}
    >
      {net.name.slice(0, 2)}
    </span>
  );
}

function TokIcon({ tok, size = 22 }: { tok: BridgeToken; size?: number }) {
  return tok.icon ? (
    <img src={tok.icon} alt={tok.symbol} width={size} height={size} className="shrink-0 rounded-full" />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      style={{ width: size, height: size }}
    >
      {tok.symbol.slice(0, 2)}
    </span>
  );
}

const sectionLabel =
  "mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500";
const selectorBtn =
  "flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600";
const dropdownMenu =
  "absolute left-0 right-0 top-full z-10 mt-1.5 flex flex-col gap-0.5 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900";
const dropdownItem =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors";

export function BridgeWidget({
  networks,
  tokens,
  fromNetwork,
  toNetwork,
  selectedToken,
  onBridge,
  onFromNetworkChange,
  onToNetworkChange,
  onTokenChange,
  loading = false,
  className,
}: BridgeWidgetProps) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState<"from" | "to" | "token" | null>(null);

  const toggle = (key: "from" | "to" | "token") => setOpen(open === key ? null : key);

  const handleSwap = () => {
    if (!fromNetwork || !toNetwork) return;
    onFromNetworkChange?.(toNetwork);
    onToNetworkChange?.(fromNetwork);
  };

  const isValid = fromNetwork && toNetwork && selectedToken && amount && Number(amount) > 0;

  return (
    <div
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <Globe size={18} className="text-gray-900 dark:text-gray-100" />
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Bridge</span>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* From / To network selectors */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          {(["from", "to"] as const).map((dir, i) => {
            const net = dir === "from" ? fromNetwork : toNetwork;
            const onChange = dir === "from" ? onFromNetworkChange : onToNetworkChange;
            return (
              <React.Fragment key={dir}>
                {i === 1 && (
                  <button
                    onClick={handleSwap}
                    disabled={!fromNetwork || !toNetwork}
                    aria-label="Swap networks"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <ArrowRightLeft size={16} className="text-gray-500" />
                  </button>
                )}
                <div>
                  <p className={sectionLabel}>{dir === "from" ? "From" : "To"}</p>
                  <div className="relative">
                    <button
                      onClick={() => toggle(dir)}
                      className={cn(
                        selectorBtn,
                        net
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-400 dark:text-gray-500",
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {net ? (
                          <>
                            <NetIcon net={net} /> {net.name}
                          </>
                        ) : (
                          "Select"
                        )}
                      </span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "shrink-0 text-gray-400 transition-transform",
                          open === dir && "rotate-180",
                        )}
                      />
                    </button>
                    {open === dir && (
                      <div className={dropdownMenu}>
                        {networks.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => {
                              onChange?.(n);
                              setOpen(null);
                            }}
                            className={cn(
                              dropdownItem,
                              n.id === net?.id
                                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50",
                            )}
                          >
                            <NetIcon net={n} /> {n.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Token selector */}
        <div>
          <p className={sectionLabel}>Token</p>
          <div className="relative">
            <button
              onClick={() => toggle("token")}
              className={cn(
                selectorBtn,
                selectedToken
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500",
              )}
            >
              <span className="flex items-center gap-2.5">
                {selectedToken ? (
                  <>
                    <TokIcon tok={selectedToken} /> {selectedToken.symbol}
                    {selectedToken.balance && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Bal: {selectedToken.balance}
                      </span>
                    )}
                  </>
                ) : (
                  "Select token"
                )}
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  "shrink-0 text-gray-400 transition-transform",
                  open === "token" && "rotate-180",
                )}
              />
            </button>
            {open === "token" && (
              <div className={dropdownMenu}>
                {tokens.map((t) => (
                  <button
                    key={t.symbol}
                    onClick={() => {
                      onTokenChange?.(t);
                      setOpen(null);
                    }}
                    className={cn(
                      dropdownItem,
                      t.symbol === selectedToken?.symbol
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50",
                    )}
                  >
                    <TokIcon tok={t} />
                    <span className="min-w-0 flex-1">
                      {t.symbol}{" "}
                      <span className="text-xs text-gray-400 dark:text-gray-500">{t.name}</span>
                    </span>
                    {t.balance && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">{t.balance}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amount input */}
        <div>
          <p className={sectionLabel}>Amount</p>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={cn(
              "w-full rounded-xl border border-gray-200 bg-transparent px-3.5 py-2.5 text-lg font-medium tabular-nums text-gray-900 placeholder:text-gray-300",
              "focus:border-gray-300 focus:outline-none dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-gray-600",
            )}
          />
        </div>

        {/* Bridge button */}
        <button
          onClick={() => {
            if (fromNetwork && toNetwork && selectedToken && amount && Number(amount) > 0) {
              onBridge?.({ from: fromNetwork, to: toNetwork, token: selectedToken, amount });
            }
          }}
          disabled={!isValid || loading}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all",
            "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
            (!isValid || loading) && "pointer-events-none opacity-50",
          )}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Bridging...
            </>
          ) : (
            "Bridge"
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {networks.length} network{networks.length !== 1 ? "s" : ""} supported
        </span>
      </div>
    </div>
  );
}

export default BridgeWidget;
