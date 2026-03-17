export interface Protocol {
  name: string;
  logoURI: string;
  address: string;
}

export interface FlashLoanToken {
  symbol: string;
  logoURI: string;
  decimals: number;
  address: string;
}

export interface FlashLoanExecutorProps {
  protocols: Protocol[];
  tokens: FlashLoanToken[];
  onExecute?: (protocol: string, token: string, amount: string) => void | Promise<void>;
  className?: string;
}
