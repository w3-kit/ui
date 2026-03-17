export function getRiskColor(risk: "low" | "medium" | "high"): string {
  return risk === "low" ? "text-green-600 dark:text-green-400" : risk === "medium" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
}
