export function statusColor(status: "active" | "claimed" | "expired") {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "claimed":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "expired":
      return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500";
  }
}
