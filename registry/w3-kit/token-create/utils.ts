import type {
  EvmTokenFormData,
  SolanaTokenFormData,
} from "./types";

/** Used by the EVM form. ERC-20 names allow most printable ASCII. */
export const EVM_TOKEN_NAME_MAX = 64;

/** Ticker symbols are short — 11 chars covers the practical upper bound. */
export const TOKEN_SYMBOL_MAX = 11;

export interface FieldError {
  field: keyof EvmTokenFormData | keyof SolanaTokenFormData;
  message: string;
}

/** Pure validator. Returns array of field errors; empty = valid. */
export function validateEvmTokenForm(data: EvmTokenFormData): FieldError[] {
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

  if (!Number.isInteger(data.decimals) || data.decimals < 0 || data.decimals > 18) {
    errors.push({ field: "decimals", message: "Decimals must be 0–18." });
  }

  const supply = data.initialSupply.trim();
  if (!supply) {
    errors.push({ field: "initialSupply", message: "Initial supply is required." });
  } else if (!/^\d+(\.\d+)?$/.test(supply)) {
    errors.push({ field: "initialSupply", message: "Use a positive number." });
  } else {
    // Reject values that would overflow an EVM uint256 when scaled.
    const whole = BigInt(supply.split(".")[0]);
    if (whole >= BigInt("115792089237316195423570985008687907853269984665640564039457")) {
      errors.push({
        field: "initialSupply",
        message: "Exceeds uint256 maximum.",
      });
    }
  }

  return errors;
}

export function validateSolanaTokenForm(data: SolanaTokenFormData): FieldError[] {
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

  if (!Number.isInteger(data.decimals) || data.decimals < 0 || data.decimals > 9) {
    errors.push({ field: "decimals", message: "Decimals must be 0–9 (SPL limit)." });
  }

  const supply = data.initialSupply.trim();
  if (!supply) {
    errors.push({ field: "initialSupply", message: "Initial supply is required." });
  } else if (!/^\d+(\.\d+)?$/.test(supply)) {
    errors.push({ field: "initialSupply", message: "Use a positive number." });
  } else {
    // u64 cap on Solana (~1.84e19). Minting more than this fails.
    const whole = BigInt(supply.split(".")[0]);
    if (whole >= BigInt("18446744073709551615")) {
      errors.push({
        field: "initialSupply",
        message: "Exceeds u64 maximum (Solana cap).",
      });
    }
  }

  return errors;
}

/**
 * Whole-token amount -> base-units string. Mirrors what the deploy
 * consumer will do before submitting the transaction.
 *
 * Example: formatBaseUnits("100", 6) === "100000000"
 */
export function formatBaseUnits(amount: string, decimals: number): string {
  const split = amount.split(".");
  const whole = split[0] ?? "";
  const frac = split[1] ?? "";
  if (!whole) return "0";
  const padded = (frac + "0".repeat(decimals)).slice(0, decimals);
  const joined = `${whole}${padded}`;
  // Strip leading zeros but keep at least one digit.
  const stripped = joined.replace(/^0+(?=\d)/, "") || "0";
  return stripped;
}
