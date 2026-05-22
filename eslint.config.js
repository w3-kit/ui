const base = (await import("@w3-kit/config/eslint")).default;

export default [
  ...base,
  {
    ignores: ["**/dist/**", "packages/create-w3-kit/**"],
  },
];
