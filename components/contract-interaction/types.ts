export interface ContractFunction {
  name: string;
  inputs: number;
  type: "view" | "write";
  description?: string;
}

export interface ContractInteractionProps {
  className?: string;
  contractAddress?: string;
  functions?: ContractFunction[];
  onExecute?: (functionName: string, inputs: string[]) => Promise<string>;
}
