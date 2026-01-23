export const animationStyles = `
  @keyframes loading-shine {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
  }

  @keyframes loading-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes loading-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes slide-in {
    from { transform: translateX(-10px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .animate-loading-shine {
    animation: loading-shine 1.5s ease-in-out infinite;
  }

  .animate-loading-pulse {
    animation: loading-pulse 1.5s ease-in-out infinite;
  }

  .animate-loading-spin {
    animation: loading-spin 1s linear infinite;
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;
