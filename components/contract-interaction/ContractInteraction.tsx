"use client";

import React, { useState } from "react";
import { Play, Eye, Edit3, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { StatusDot } from "../ui/status-dot";
import { ContractFunction, ContractInteractionProps } from "./types";
import { DEFAULT_FUNCTIONS } from "./utils";

export type { ContractFunction, ContractInteractionProps };

interface Result {
  fn: string;
  value: string;
  status: "success" | "error";
}

export function ContractInteraction({
  className,
  contractAddress: defaultAddress = "",
  functions = DEFAULT_FUNCTIONS,
  onExecute,
}: ContractInteractionProps) {
  const [address, setAddress] = useState(defaultAddress);
  const [activeTab, setActiveTab] = useState<"view" | "write">("view");
  const [selectedFn, setSelectedFn] = useState<ContractFunction | null>(null);
  const [inputs, setInputs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const filteredFunctions = functions.filter((f) => f.type === activeTab);

  const handleSelectFn = (fn: ContractFunction) => {
    setSelectedFn(fn);
    setInputs(Array(fn.inputs).fill(""));
  };

  const handleExecute = async () => {
    if (!selectedFn) return;
    setLoading(true);
    try {
      const result = onExecute
        ? await onExecute(selectedFn.name, inputs)
        : `Mock result for ${selectedFn.name}`;
      setResults((prev) => [{ fn: selectedFn.name, value: result, status: "success" }, ...prev]);
    } catch {
      setResults((prev) => [
        { fn: selectedFn.name, value: "Execution failed", status: "error" },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Contract Interaction
        </h3>
        <Input
          placeholder="Contract address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="font-mono text-xs"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        {(["view", "write"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedFn(null);
            }}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors duration-150",
              activeTab === tab
                ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
            )}
          >
            {tab === "view" ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
            {tab === "view" ? "Read" : "Write"}
          </button>
        ))}
      </div>

      {/* Functions */}
      <div className="p-4 space-y-2">
        {filteredFunctions.map((fn) => (
          <button
            key={fn.name}
            onClick={() => handleSelectFn(fn)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors duration-150",
              selectedFn?.name === fn.name
                ? "bg-gray-100 dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-900",
            )}
          >
            <div>
              <p className="text-sm font-medium font-mono text-gray-900 dark:text-white">
                {fn.name}
              </p>
              {fn.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{fn.description}</p>
              )}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {fn.inputs} {fn.inputs === 1 ? "input" : "inputs"}
            </span>
          </button>
        ))}

        {/* Input fields */}
        {selectedFn && selectedFn.inputs > 0 && (
          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            {Array.from({ length: selectedFn.inputs }).map((_, i) => (
              <Input
                key={i}
                placeholder={`Input ${i + 1}`}
                value={inputs[i] || ""}
                onChange={(e) => {
                  const newInputs = [...inputs];
                  newInputs[i] = e.target.value;
                  setInputs(newInputs);
                }}
                className="font-mono text-xs"
              />
            ))}
          </div>
        )}

        {/* Execute */}
        {selectedFn && (
          <Button onClick={handleExecute} disabled={loading} size="sm" className="w-full mt-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Execute {selectedFn.name}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">Results</div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {results.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5">
                <StatusDot status={r.status === "success" ? "success" : "error"} />
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{r.fn}</span>
                <span className="text-xs text-gray-900 dark:text-white ml-auto truncate max-w-[200px]">
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractInteraction;
