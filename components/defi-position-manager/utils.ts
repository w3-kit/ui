export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

export function getRiskVariant(risk: "low" | "medium" | "high"): "success" | "warning" | "error" {
  return risk === "low" ? "success" : risk === "medium" ? "warning" : "error";
}
