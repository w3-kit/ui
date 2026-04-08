import { DesignTokens } from "../types.js";
import { readFileSync } from "node:fs";

export function extractTokensFromFile(filePath: string): DesignTokens {
  const source = readFileSync(filePath, "utf-8");
  return extractTokensFromSource(source);
}

export function extractTokensFromSource(source: string): DesignTokens {
  const empty: DesignTokens = {
    colors: {},
    spacing: {},
    typography: { fontSizes: {}, fontFamily: {}, letterSpacing: {} },
  };

  try {
    const wrapped = `
      const module = { exports: {} };
      ${source}
      return module.exports;
    `;
    // eslint-disable-next-line no-new-func
    const config = new Function(wrapped)();
    const extend = config?.theme?.extend ?? {};

    return {
      colors: extend.colors ?? {},
      spacing: extend.spacing ?? {},
      typography: {
        fontSizes: extend.fontSize ?? {},
        fontFamily: extend.fontFamily ?? {},
        letterSpacing: extend.letterSpacing ?? {},
      },
    };
  } catch {
    return empty;
  }
}
