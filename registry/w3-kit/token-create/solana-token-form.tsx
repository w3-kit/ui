"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { SolanaTokenFormData } from "./types";
import {
  EVM_TOKEN_NAME_MAX,
  TOKEN_SYMBOL_MAX,
  validateSolanaTokenForm,
  type FieldError,
} from "./utils";

export interface SolanaTokenFormProps {
  value: SolanaTokenFormData;
  onChange: (next: SolanaTokenFormData) => void;
  errors?: FieldError[];
  disabled?: boolean;
}

const errorFor = (errors: FieldError[] | undefined, field: FieldError["field"]) =>
  errors?.find((e) => e.field === field)?.message;

function fieldClass(hasError?: boolean) {
  return cn(
    "w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 dark:text-gray-100",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-500/60"
      : "border-gray-200 focus:border-gray-300 focus:ring-gray-200 dark:border-gray-700 dark:focus:border-gray-600 dark:focus:ring-gray-700",
  );
}

export function SolanaTokenForm({ value, onChange, errors, disabled }: SolanaTokenFormProps) {
  const update = <K extends keyof SolanaTokenFormData>(k: K, v: SolanaTokenFormData[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <form
      aria-label="SPL token configuration"
      className="flex flex-col gap-4"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Name
          </span>
          <input
            type="text"
            value={value.name}
            maxLength={EVM_TOKEN_NAME_MAX}
            disabled={disabled}
            onChange={(e) => update("name", e.target.value)}
            placeholder="My Token"
            aria-invalid={!!errorFor(errors, "name")}
            className={fieldClass(!!errorFor(errors, "name"))}
          />
          {errorFor(errors, "name") && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errorFor(errors, "name")}
            </p>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Symbol
          </span>
          <input
            type="text"
            value={value.symbol}
            maxLength={TOKEN_SYMBOL_MAX}
            disabled={disabled}
            onChange={(e) => update("symbol", e.target.value.toUpperCase())}
            placeholder="MTK"
            aria-invalid={!!errorFor(errors, "symbol")}
            className={fieldClass(!!errorFor(errors, "symbol"))}
          />
          {errorFor(errors, "symbol") && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errorFor(errors, "symbol")}
            </p>
          )}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Decimals
          </span>
          <input
            type="number"
            min={0}
            max={9}
            step={1}
            value={value.decimals}
            disabled={disabled}
            onChange={(e) =>
              update("decimals", Math.max(0, Math.min(9, Number(e.target.value) || 0)))
            }
            className={fieldClass(!!errorFor(errors, "decimals"))}
          />
          {errorFor(errors, "decimals") && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errorFor(errors, "decimals")}
            </p>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Initial supply
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={value.initialSupply}
            disabled={disabled}
            onChange={(e) => update("initialSupply", e.target.value)}
            placeholder="1000000"
            aria-invalid={!!errorFor(errors, "initialSupply")}
            className={fieldClass(!!errorFor(errors, "initialSupply"))}
          />
          {errorFor(errors, "initialSupply") && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errorFor(errors, "initialSupply")}
            </p>
          )}
        </label>
      </div>

      <fieldset className="flex flex-col gap-2" aria-label="Mint authority">
        <legend className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Mint authority
        </legend>
        <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="radio"
            name="mintAuthority"
            value="self"
            checked={value.mintAuthority === "self"}
            disabled={disabled}
            onChange={() => update("mintAuthority", "self")}
            className="mt-0.5 h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
          <span>
            <span className="font-medium">Keep authority</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              You can mint more supply later (canonical SPL pattern).
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="radio"
            name="mintAuthority"
            value="renounced"
            checked={value.mintAuthority === "renounced"}
            disabled={disabled}
            onChange={() => update("mintAuthority", "renounced")}
            className="mt-0.5 h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
          <span>
            <span className="font-medium">Renounce</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              Fixed supply forever. Mirrors "burn the keys" mint controls.
            </span>
          </span>
        </label>
      </fieldset>
    </form>
  );
}

/** Convenience: validate-only wrapper for callers. */
export function validateSolana(value: SolanaTokenFormData): FieldError[] {
  return validateSolanaTokenForm(value);
}
