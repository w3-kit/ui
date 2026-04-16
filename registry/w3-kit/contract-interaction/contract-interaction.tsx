"use client";

import React, { useState } from "react";
import { Code, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContractInteractionProps, ContractFunction } from "./types";
import { truncateAddress } from "./utils";

export function ContractInteraction({
  address,
  functions,
  onExecute,
  executingFn,
  className,
}: ContractInteractionProps) {
  const [tab, setTab] = useState<"read" | "write">("read");
  const [inputValues, setInputValues] = useState<Record<string, string[]>>({});
  const [results] = useState<Record<string, string>>({});

  const filtered = functions.filter((fn) => fn.type === tab);

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
          const result = results[fn.name];

          return (
            <div key={fn.name} className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{fn.name}</p>

              {fn.inputs.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {fn.inputs.map((label, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={label}
                      value={values[idx] ?? ""}
                      onChange={(e) => setFieldValue(fn, idx, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-gray-600"
                    />
                  ))}
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
                {isExecuting ? "Executing..." : "Execute"}
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
    </div>
  );
}
