export interface ContractFunctionInput {
  label?: string;
  placeholder?: string;
  helper?: string;
}

export interface ContractFunction {
  name: string;
  type: "read" | "write";
  /** Simple placeholder/label strings, one per input. */
  inputs: string[];
  /** Rich per-input metadata, indexed by position. Falls back to `inputs` when omitted. */
  inputDetails?: ContractFunctionInput[];
  description?: string;
  /** Declared output types, e.g. `["uint256"]`. */
  outputs?: string[];
}

export interface ContractInteractionProps {
  address?: string;
  /** Token/contract standard shown as a small badge in the header (e.g. `"ERC-20"`). */
  standard?: string;
  functions: ContractFunction[];
  onExecute?: (fn: ContractFunction, values: string[]) => void;
  executingFn?: string;
  /** Map of function name to last execution result text. */
  results?: Record<string, string>;
  className?: string;
}
