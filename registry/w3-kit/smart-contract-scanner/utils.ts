import { SecurityCheck } from "./types";

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function getStatusColor(status: SecurityCheck["status"]): string {
  switch (status) {
    case "safe":
      return "text-success";
    case "warning":
      return "text-warning";
    case "danger":
      return "text-destructive";
    default:
      return "text-muted-foreground";
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
