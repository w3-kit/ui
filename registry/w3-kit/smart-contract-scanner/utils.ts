import { SecurityCheck } from "./types";

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function getStatusColor(status: SecurityCheck["status"]): string {
  switch (status) {
    case "safe":
      return "text-green-500 dark:text-green-400";
    case "warning":
      return "text-yellow-500 dark:text-yellow-400";
    case "danger":
      return "text-red-500 dark:text-red-400";
    default:
      return "text-gray-500 dark:text-gray-400";
  }
}

export function getCodePreview(sourceCode: string, maxLines = 15): string {
  const lines = sourceCode.split("\n");
  if (lines.length <= maxLines) return sourceCode;

  return lines.slice(0, maxLines).join("\n") + "\n...";
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
