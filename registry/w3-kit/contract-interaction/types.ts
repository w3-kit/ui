export interface ContractFunction {
  name: string;
  type: "read" | "write";
  inputs: string[];
}

export interface ContractInteractionProps {
  address?: string;
  functions: ContractFunction[];
  onExecute?: (fn: ContractFunction, values: string[]) => void;
  executingFn?: string;
  className?: string;
}
