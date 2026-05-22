"use client";

import React, { useState } from "react";
import { Code, Loader2, Play, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContractInteractionProps, ContractFunction } from "./types";
import { truncateAddress } from "./utils";

export function ContractInteraction({
  address,
  standard,
  functions,
  onExecute,
  executingFn,
  results,
  className,
}: ContractInteractionProps) {
  const [tab, setTab] = useState<"read" | "write">("read");
  const [inputValues, setInputValues] = useState<Record<string, string[]>>({});

  const filtered = functions.filter((fn) => fn.type === tab);
  const readCount = functions.filter((f) => f.type === "read").length;
  const writeCount = functions.filter((f) => f.type === "write").length;

  function getValues(fn: ContractFunction) {
    return inputValues[fn.name] ?? fn.inputs.map(() => "");
  }

  function setFieldValue(fn: ContractFunction, idx: number, value: string) {
    const current = getValues(fn);
    const next = [...current];
    next[idx] = value;
    setInputValues((prev) => ({ ...prev, [fn.name]: next }));
  }

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Code className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Contract</h3>
        {standard && (
          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {standard}
          </span>
        )}
        {address && (
          <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {truncateAddress(address)}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-t border-gray-200 dark:border-gray-800">
        {(["read", "write"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "border-b-2 border-gray-900 text-gray-900 dark:border-white dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Function list */}
      <div className="space-y-1 p-3">
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            No {tab} functions
          </p>
        )}

        {filtered.map((fn) => {
          const values = getValues(fn);
          const isExecuting = executingFn === fn.name;
          const result = results?.[fn.name];

          return (
            <div key={fn.name} className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{fn.name}</p>
                {fn.outputs && fn.outputs.length > 0 && (
                  <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
                    → {fn.outputs.join(", ")}
                  </span>
                )}
              </div>
              {fn.description && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{fn.description}</p>
              )}

              {fn.inputs.length > 0 && (
                <div className="mt-2 space-y-2">
                  {fn.inputs.map((label, idx) => {
                    const detail = fn.inputDetails?.[idx];
                    const inputLabel = detail?.label ?? label;
                    const placeholder = detail?.placeholder ?? label;
                    return (
                      <div key={idx}>
                        {(detail?.label || detail?.helper) && (
                          <div className="mb-1 flex items-center justify-between">
                            {detail?.label && (
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {inputLabel}
                              </span>
                            )}
                            {detail?.helper && (
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                {detail.helper}
                              </span>
                            )}
                          </div>
                        )}
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={values[idx] ?? ""}
                          onChange={(e) => setFieldValue(fn, idx, e.target.value)}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-gray-600"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {fn.type === "write" && (
                <div className="mt-2 flex items-center gap-1.5 rounded-md bg-amber-100/60 px-2 py-1 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  <Wallet className="h-3 w-3" />
                  Requires wallet signature
                </div>
              )}

              <button
                onClick={() => onExecute?.(fn, values)}
                disabled={isExecuting}
                className={cn(
                  "mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  fn.type === "read"
                    ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
                  isExecuting && "cursor-not-allowed opacity-60",
                )}
              >
                {isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {isExecuting ? "Executing..." : fn.type === "read" ? "Query" : "Execute"}
              </button>

              {result && (
                <p className="mt-2 rounded-lg bg-white px-3 py-2 font-mono text-xs text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                  {result}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 dark:border-gray-800">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {functions.length} function{functions.length !== 1 ? "s" : ""}
        </span>
        <span className="text-[11px] text-gray-400 dark:text-gray-500">
          {readCount} read · {writeCount} write
        </span>
      </div>
    </div>
  );
}
