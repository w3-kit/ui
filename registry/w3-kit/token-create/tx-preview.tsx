"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Chain } from "../chain-selector/types";
import type { EvmTokenFormData, SolanaTokenFormData } from "./types";
import { formatBaseUnits } from "./utils";

export interface TxPreviewProps {
  chain: Chain;
  data: EvmTokenFormData | SolanaTokenFormData;
  className?: string;
}

interface Row {
  label: string;
  value: React.ReactNode;
}

function RowList({ rows }: { rows: Row[] }) {
  return (
    <dl className="flex flex-col divide-y divide-gray-100 text-sm dark:divide-gray-800">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-3 py-2.5"
        >
          <dt className="text-gray-500 dark:text-gray-400">{row.label}</dt>
          <dd className="font-mono text-gray-900 dark:text-gray-100">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TruncateMono({ value }: { value: string }) {
  if (value.length <= 14) return <span>{value}</span>;
  return <span title={value}>{value.slice(0, 6)}…{value.slice(-4)}</span>;
}

export function TxPreview({ chain, data, className }: TxPreviewProps) {
  const isEvm = chain.ecosystem === "evm";
  const evm = isEvm ? (data as EvmTokenFormData) : null;
  const sol = !isEvm ? (data as SolanaTokenFormData) : null;

  const baseUnits = formatBaseUnits(data.initialSupply || "0", data.decimals);

  const rows: Row[] = [
    { label: "Network", value: chain.name },
    { label: "Token standard", value: isEvm ? "ERC-20" : "SPL" },
    { label: "Name", value: data.name },
    { label: "Symbol", value: data.symbol },
    { label: "Decimals", value: data.decimals },
    { label: "Initial supply", value: `${data.initialSupply || "0"} (raw: ${baseUnits})` },
  ];

  if (evm) {
    rows.push({
      label: "Extensions",
      value: (
        <span className="flex flex-wrap justify-end gap-1">
          {evm.mintable && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium dark:bg-gray-800">
              mintable
            </span>
          )}
          {evm.burnable && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium dark:bg-gray-800">
              burnable
            </span>
          )}
          {!evm.mintable && !evm.burnable && <span className="text-gray-400">none</span>}
        </span>
      ),
    });
  }
  if (sol) {
    rows.push({
      label: "Mint authority",
      value: sol.mintAuthority === "self" ? "creator (kept)" : "renounced",
    });
  }

  rows.push({
    label: "Deployer",
    value: <TruncateMono value="0xYourWallet…1234" />,
  });

  return (
    <section
      aria-label="Transaction preview"
      className={cn(
        "rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50",
        className,
      )}
    >
      <header className="mb-3 flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Review
        </span>
        <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {isEvm ? "ERC-20" : "SPL"} on {chain.name}
        </span>
      </header>
      <RowList rows={rows} />
    </section>
  );
}
