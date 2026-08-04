"use client";

import React, { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChainSelector } from "../chain-selector/chain-selector";
import type { Chain } from "../chain-selector/types";
import type {
  DeployRequest,
  DeployResult,
  EvmTokenFormData,
  SolanaTokenFormData,
  StepDescriptor,
  TokenCreateProps,
  TokenCreateStep,
} from "./types";
import { validateEvmTokenForm, validateSolanaTokenForm } from "./utils";
import { EvmTokenForm } from "./evm-token-form";
import { SolanaTokenForm } from "./solana-token-form";
import { TxPreview } from "./tx-preview";
import { PendingOverlay, Progress } from "./progress";
import { ResultCard } from "./result-card";

const STEPS: StepDescriptor[] = [
  { id: "chain", label: "Chain" },
  { id: "configure", label: "Configure" },
  { id: "preview", label: "Review" },
  { id: "result", label: "Done" },
];

const initialEvmData: EvmTokenFormData = {
  name: "",
  symbol: "",
  decimals: 18,
  initialSupply: "",
  mintable: true,
  burnable: false,
};

const initialSolanaData: SolanaTokenFormData = {
  name: "",
  symbol: "",
  decimals: 9,
  initialSupply: "",
  mintAuthority: "self",
};

export function TokenCreate({ chains, defaultChainId, onDeploy, className }: TokenCreateProps) {
  const [step, setStep] = useState<TokenCreateStep>("chain");
  const [selectedChainId, setSelectedChainId] = useState<number | string | undefined>(
    defaultChainId,
  );
  const [evmData, setEvmData] = useState<EvmTokenFormData>(initialEvmData);
  const [solanaData, setSolanaData] = useState<SolanaTokenFormData>(initialSolanaData);
  const [evmErrors, setEvmErrors] = useState<ReturnType<typeof validateEvmTokenForm>>([]);
  const [solanaErrors, setSolanaErrors] = useState<ReturnType<typeof validateSolanaTokenForm>>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<DeployResult | null>(null);

  const selectedChain = useMemo(
    // Normalize both sides to string so a numeric chainId in `chains`
    // matches a string defaultChainId (and vice versa) — strict ===
    // would silently miss.
    () => chains.find((c) => String(c.chainId) === String(selectedChainId ?? "")),
    [chains, selectedChainId],
  );

  const isEvm = selectedChain?.ecosystem === "evm";
  const currentData: EvmTokenFormData | SolanaTokenFormData = isEvm ? evmData : solanaData;

  const handleSelectChain = useCallback((chainId: number | string) => {
    setSelectedChainId(chainId);
    setSubmitError(null);
    setStep("configure");
  }, []);

  const handleBackFromConfig = useCallback(() => {
    setStep("chain");
    setEvmErrors([]);
    setSolanaErrors([]);
  }, []);

  const validateCurrent = useCallback((): boolean => {
    if (!selectedChain) return false;
    if (selectedChain.ecosystem === "evm") {
      const errs = validateEvmTokenForm(evmData);
      setEvmErrors(errs);
      setSolanaErrors([]);
      return errs.length === 0;
    }
    const errs = validateSolanaTokenForm(solanaData);
    setSolanaErrors(errs);
    setEvmErrors([]);
    return errs.length === 0;
  }, [selectedChain, evmData, solanaData]);

  const handlePreview = useCallback(() => {
    if (!validateCurrent()) return;
    setStep("preview");
  }, [validateCurrent]);

  const handleSubmit = useCallback(async () => {
    if (!selectedChain) return;
    setStep("submitting");
    setSubmitError(null);
    try {
      const req: DeployRequest = {
        chain: selectedChain as Chain,
        data: selectedChain.ecosystem === "evm" ? evmData : solanaData,
      };
      const deployed = await onDeploy(req);
      setResult(deployed);
      setStep("result");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Deployment failed.";
      setSubmitError(message);
      setStep("preview");
    }
  }, [selectedChain, evmData, solanaData, onDeploy]);

  const handleReset = useCallback(() => {
    setStep("chain");
    setSelectedChainId(defaultChainId);
    setEvmData(initialEvmData);
    setSolanaData(initialSolanaData);
    setEvmErrors([]);
    setSolanaErrors([]);
    setSubmitError(null);
    setResult(null);
  }, [defaultChainId]);

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <section
      aria-label="Create a token"
      className={cn(
        "w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Stepper */}
      <header className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <Sparkles size={14} />
          </span>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Create a token
          </h2>
        </div>
        <Progress steps={STEPS} current={step} />
      </header>

      {/* Body */}
      <div className="flex flex-col gap-4 p-5">
        {step === "chain" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pick a target chain. The form adapts to EVM or Solana automatically.
            </p>
            <ChainSelector
              chains={chains}
              selectedChainId={selectedChainId}
              onSelect={handleSelectChain}
            />
          </div>
        )}

        {step === "configure" && selectedChain && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleBackFromConfig}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeft size={12} />
                Change chain
              </button>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {selectedChain.ecosystem === "evm" ? "ERC-20" : "SPL"} on {selectedChain.name}
              </span>
            </div>
            {isEvm ? (
              <EvmTokenForm value={evmData} onChange={setEvmData} errors={evmErrors} />
            ) : (
              <SolanaTokenForm value={solanaData} onChange={setSolanaData} errors={solanaErrors} />
            )}
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Preview deployment
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === "preview" && selectedChain && (
          <div className="flex flex-col gap-4">
            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
              >
                {submitError}
              </div>
            )}
            <TxPreview chain={selectedChain} data={currentData} />
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Deploy now
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => setStep("configure")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
              >
                <ArrowLeft size={14} />
                Edit configuration
              </button>
            </div>
          </div>
        )}

        {step === "submitting" && (
          <PendingOverlay message="Awaiting on-chain confirmation…" complete={false} />
        )}

        {step === "result" && selectedChain && result && (
          <div className="flex flex-col gap-4">
            <ResultCard chain={selectedChain} result={result} />
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
            >
              <RotateCw size={14} />
              Create another token
            </button>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-100 px-5 py-3 text-center dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Presentation-only — supply your own deployer via <code>onDeploy</code>.
        </span>
      </footer>
    </section>
  );
}

export default TokenCreate;
