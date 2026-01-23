export interface Protocol {
  name: string;
  logoURI: string;
  address: string;
}

export interface Token {
  symbol: string;
  logoURI: string;
  decimals: number;
  address: string;
}

export interface FlashLoanData {
  id: string;
  protocol: Protocol;
  token: Token;
  amount: string;
  profit: string;
  risk: "low" | "medium" | "high";
  status: "pending" | "executing" | "completed" | "failed";
  timestamp: number;
}

export interface FlashLoanExecutorProps {
  protocols: Protocol[];
  tokens: Token[];
  onExecute?: (data: Omit<FlashLoanData, "id" | "timestamp">) => void | Promise<void>;
  className?: string;
  estimatedProfit?: string;
  riskLevel?: FlashLoanData["risk"];
}

export interface FormErrors {
  amount?: string;
  protocol?: string;
  token?: string;
}
