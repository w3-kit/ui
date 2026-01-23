import { OrderData, FormErrors } from "./types";

export function getStatusColor(status: OrderData["status"]): string {
  switch (status) {
    case "active":
      return "text-green-500 dark:text-green-400";
    case "executed":
      return "text-blue-500 dark:text-blue-400";
    case "cancelled":
      return "text-red-500 dark:text-red-400";
  }
}

export function validateOrderForm(
  amount: string,
  price: string,
  expiry: string
): FormErrors {
  const errors: FormErrors = {};

  if (!amount || parseFloat(amount) <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!price || parseFloat(price) <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (expiry && (parseInt(expiry) <= 0 || parseInt(expiry) > 30)) {
    errors.expiry = "Expiry must be between 1 and 30 days";
  }

  return errors;
}

export function formatStatus(status: OrderData["status"]): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function calculateExpiry(days: string): number | undefined {
  if (!days) return undefined;
  return Date.now() + parseInt(days) * 24 * 60 * 60 * 1000;
}

export const DEFAULT_TOKEN = {
  symbol: "ETH",
  logoURI:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  price: 2845.67,
};
