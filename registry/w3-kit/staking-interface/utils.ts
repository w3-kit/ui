export const formatNumber = (value: string | number, decimals: number = 2) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const getAPRColorClass = (apr: number) => {
  if (apr >= 20) return "text-success";
  if (apr >= 10) return "text-success";
  return "text-primary";
};

export const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { max-height: 0; opacity: 0; }
  to { max-height: 1000px; opacity: 1; }
}

@keyframes slideUp {
  from { max-height: 1000px; opacity: 1; }
  to { max-height: 0; opacity: 0; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
`;
