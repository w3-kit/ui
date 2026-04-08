import { PropDefinition } from "../types.js";

export interface ExtractedInterface {
  name: string;
  props: PropDefinition[];
}

export function extractInterfaces(source: string): ExtractedInterface[] {
  const results: ExtractedInterface[] = [];
  const interfaceRegex = /export\s+interface\s+(\w+)(?:\s+extends\s+\w+)?\s*\{/g;
  let match: RegExpExecArray | null;

  while ((match = interfaceRegex.exec(source)) !== null) {
    const name = match[1];
    const startIndex = match.index + match[0].length;
    const body = extractBody(source, startIndex);
    const props = parseProps(body);
    results.push({ name, props });
  }

  return results;
}

function extractBody(source: string, startIndex: number): string {
  let depth = 1;
  let i = startIndex;
  while (i < source.length && depth > 0) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") depth--;
    i++;
  }
  return source.slice(startIndex, i - 1);
}

function parseProps(body: string): PropDefinition[] {
  const props: PropDefinition[] = [];
  let i = 0;

  while (i < body.length) {
    while (i < body.length && /\s/.test(body[i])) i++;
    if (i >= body.length) break;

    const nameMatch = body.slice(i).match(/^(\w+)(\?)?:\s*/);
    if (!nameMatch) {
      const nextLine = body.indexOf("\n", i);
      i = nextLine === -1 ? body.length : nextLine + 1;
      continue;
    }

    const propName = nameMatch[1];
    const optional = nameMatch[2] === "?";
    i += nameMatch[0].length;

    const type = extractType(body, i);
    i += type.raw.length;

    const trailing = body.slice(i).match(/^[;\s]*(\/\/[^\n]*)?\n?/);
    if (trailing) i += trailing[0].length;

    props.push({ name: propName, type: type.cleaned, optional });
  }

  return props;
}

function extractType(body: string, start: number): { raw: string; cleaned: string } {
  let i = start;
  let braceDepth = 0; // tracks { }
  let parenDepth = 0; // tracks ( )
  let angleDepth = 0; // tracks < >

  while (i < body.length) {
    const ch = body[i];
    if (ch === "{") braceDepth++;
    if (ch === "}") {
      braceDepth--;
      if (braceDepth < 0) break;
    }
    if (ch === "(") parenDepth++;
    if (ch === ")") {
      parenDepth--;
      if (parenDepth < 0) break;
    }
    if (ch === "<") angleDepth++;
    if (ch === ">") {
      // Only treat as closing angle if we're actually inside one,
      // otherwise it could be part of => arrow
      if (angleDepth > 0) {
        angleDepth--;
      }
      // If not inside angle brackets, it's part of => — skip
    }
    const totalDepth = braceDepth + parenDepth + angleDepth;
    if (totalDepth === 0 && (ch === ";" || ch === "\n")) break;
    i++;
  }

  const raw = body.slice(start, i);
  const cleaned = raw.replace(/\/\/.*$/gm, "").trim();
  return { raw, cleaned };
}
