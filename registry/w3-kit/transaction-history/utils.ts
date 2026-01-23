export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

export function formatEther(value: string): string {
  const num = Number(value) / 1e18;
  return num.toFixed(4);
}

export function getStatusColor(status: 'pending' | 'success' | 'failed'): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideDown {
    from { max-height: 0; opacity: 0; transform: translateY(-10px); }
    to { max-height: 500px; opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { max-height: 500px; opacity: 1; transform: translateY(0); }
    to { max-height: 0; opacity: 0; transform: translateY(-10px); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-slideDown {
    animation: slideDown 0.3s ease-out forwards;
    overflow: hidden;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-in forwards;
    overflow: hidden;
  }

  .transition-height {
    transition: max-height 0.3s ease-out, opacity 0.3s ease-out, transform 0.3s ease-out;
    overflow: hidden;
  }
`;
