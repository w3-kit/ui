import type { EvmTokenFormData, SolanaTokenFormData } from "./types";

/** Used by the EVM form. ERC-20 names allow most printable ASCII. */
export const EVM_TOKEN_NAME_MAX = 64;

/** Ticker symbols are short — 11 chars covers the practical upper bound. */
export const TOKEN_SYMBOL_MAX = 11;

export interface FieldError {
  field: keyof EvmTokenFormData | keyof SolanaTokenFormData;
  message: string;
}

/** EVM uint256 maximum — the largest integer the EVM can address. */
const UINT256_MAX = (BigInt(1) << BigInt(256)) - BigInt(1);

/** Solana u64 maximum — the largest integer the SPL token program accepts. */
const U64_MAX = (BigInt(1) << BigInt(64)) - BigInt(1);

/**
 * Per-chain numeric constraints. Shared by the validators — adding a new
 * chain type means adding a row here, not duplicating the validator.
 */
interface ChainConstraints {
  /** Max decimals for the standard (EVM = 18, SPL = 9). */
  decimalsMax: number;
  /** Largest accepted integer in *whole* units (i.e. the user-typed value
   * before scaling by decimals). For EVM we derive it from decimals so
   * low-decimal tokens aren't over-rejected; for Solana we cap at u64. */
  supplyWholeMax: (decimals: number) => bigint;
}

const EVM_CONSTRAINTS: ChainConstraints = {
  decimalsMax: 18,
  // Whole-token cap = uint256_max / 10^decimals, rounded down. Anything
  // bigger would overflow once scaled into base units.
  supplyWholeMax: (decimals) => {
    // Manual 10^n — BigInt exponentiation (`**`) is ES2020+.
    let pow = BigInt(1);
    for (let i = 0; i < decimals; i++) pow = pow * BigInt(10);
    return UINT256_MAX / pow;
  },
};

const SOLANA_CONSTRAINTS: ChainConstraints = {
  decimalsMax: 9,
  // Solana caps mint amounts at u64 regardless of decimals.
  supplyWholeMax: () => U64_MAX,
};

/** Validate the shared name/symbol block. */
function validateNameAndSymbol(data: { name: string; symbol: string }): FieldError[] {
  const errors: FieldError[] = [];

  const name = data.name.trim();
  if (!name) {
    errors.push({ field: "name", message: "Name is required." });
  } else if (name.length > EVM_TOKEN_NAME_MAX) {
    errors.push({ field: "name", message: `Max ${EVM_TOKEN_NAME_MAX} characters.` });
  }

  const symbol = data.symbol.trim().toUpperCase();
  if (!symbol) {
    errors.push({ field: "symbol", message: "Symbol is required." });
  } else if (symbol.length > TOKEN_SYMBOL_MAX) {
    errors.push({ field: "symbol", message: `Max ${TOKEN_SYMBOL_MAX} characters.` });
  } else if (!/^[A-Z0-9]+$/.test(symbol)) {
    errors.push({ field: "symbol", message: "Letters and digits only." });
  }

  return errors;
}

/** Validate decimals + initial supply against chain constraints. */
function validateDecimalsAndSupply(
  data: { decimals: number; initialSupply: string },
  constraints: ChainConstraints,
  decimalsRangeLabel: string,
  supplyCapLabel: string,
): FieldError[] {
  const errors: FieldError[] = [];

  if (
    !Number.isInteger(data.decimals) ||
    data.decimals < 0 ||
    data.decimals > constraints.decimalsMax
  ) {
    errors.push({
      field: "decimals",
      message: `Decimals must be 0–${constraints.decimalsMax}${decimalsRangeLabel}.`,
    });
    // Without a valid decimals, supply validation isn't meaningful.
    return errors;
  }

  const supply = data.initialSupply.trim();
  if (!supply) {
    errors.push({ field: "initialSupply", message: "Initial supply is required." });
    return errors;
  }

  const m = /^(\d+)(?:\.(\d+))?$/.exec(supply);
  if (!m) {
    errors.push({ field: "initialSupply", message: "Use a positive number." });
    return errors;
  }

  const whole = BigInt(m[1]);
  const frac = m[2] ?? "";

  // Reject over-precision so the contract never silently truncates.
  if (frac.length > data.decimals) {
    errors.push({
      field: "initialSupply",
      message: `At most ${data.decimals} fractional digit${data.decimals === 1 ? "" : "s"} allowed (matches decimals).`,
    });
  }

  if (whole > constraints.supplyWholeMax(data.decimals)) {
    errors.push({
      field: "initialSupply",
      message: `Exceeds ${supplyCapLabel}.`,
    });
  }

  return errors;
}

export function validateEvmTokenForm(data: EvmTokenFormData): FieldError[] {
  return [
    ...validateNameAndSymbol(data),
    ...validateDecimalsAndSupply(data, EVM_CONSTRAINTS, "", "uint256 maximum"),
  ];
}

export function validateSolanaTokenForm(data: SolanaTokenFormData): FieldError[] {
  return [
    ...validateNameAndSymbol(data),
    ...validateDecimalsAndSupply(
      data,
      SOLANA_CONSTRAINTS,
      " (SPL limit)",
      "u64 maximum (Solana cap)",
    ),
  ];
}

/**
 * Whole-token amount -> base-units string. Mirrors what the deploy
 * consumer will do before submitting the transaction.
 *
 * Example: formatBaseUnits("100", 6) === "100000000"
 *
 * The caller is expected to have validated the supply first; this function
 * will throw if `decimals` is negative or `amount` is malformed.
 */
export function formatBaseUnits(amount: string, decimals: number): string {
  if (decimals < 0 || !Number.isInteger(decimals)) {
    throw new Error(`decimals must be a non-negative integer, got ${decimals}`);
  }
  const split = amount.split(".");
  const whole = split[0] ?? "";
  const frac = split[1] ?? "";
  if (!/^\d+$/.test(whole) || (frac && !/^\d+$/.test(frac))) {
    throw new Error(`amount must be a non-negative decimal string, got "${amount}"`);
  }
  if (!whole && !frac) return "0";
  const padded = (frac + "0".repeat(decimals)).slice(0, decimals);
  const joined = `${whole}${padded}`;
  const stripped = joined.replace(/^0+(?=\d)/, "") || "0";
  return stripped;
}
