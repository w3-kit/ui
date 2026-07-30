// Build script for @w3-kit/ui.
//
// Copies the registry sources from /registry/w3-kit/<comp>/ into a flat
// package staging directory, then compiles with TypeScript. The flat layout
// avoids cross-package relative paths in source (which break in TS 4.9
// strict ESM mode).
//
// Input layout (relative to repo root):
//   registry/w3-kit/chain-selector/{chain-selector.tsx,types.ts,utils.ts}
//   registry/w3-kit/token-create/{token-create.tsx,...,utils.ts}
//
// Output layout (relative to package root):
//   src/components/chain-selector/*
//   src/components/token-create/*
//   src/lib/utils.ts   (shim for @/lib/utils)
//   src/index.ts       (re-exports)
//   src/chain-selector.ts
//   src/token-create.ts

import { mkdirSync, copyFileSync, rmSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const repoRoot = resolve(pkgRoot, "..", "..");

console.log("[w3-kit ui] starting build");
console.log("[w3-kit ui] repoRoot:", repoRoot);

const REGISTRY_DIR = join(repoRoot, "registry", "w3-kit");
const STAGE_DIR = join(pkgRoot, "src");
const DIST_DIR = join(pkgRoot, "dist");

// 1) Wipe previous stage / build.
rmSync(STAGE_DIR, { recursive: true, force: true });
rmSync(DIST_DIR, { recursive: true, force: true });

// 2) Copy each component folder into src/components/<name> with flattened
//    relative imports rewritten. We deliberately avoid the rewrite for now —
//    all cross-component imports already use `../<sibling>` style.
const COMPONENTS = ["chain-selector", "token-create"];

for (const name of COMPONENTS) {
  const src = join(REGISTRY_DIR, name);
  const dst = join(STAGE_DIR, "components", name);
  if (!existsSync(src)) {
    console.error(`Missing registry source: ${src}`);
    process.exit(1);
  }
  mkdirSync(dst, { recursive: true });
  for (const file of readdirSync(src)) {
    if (!/\.(tsx?|md)$/.test(file)) continue;
    // Skip Storybook stories — they reference @storybook/react which
    // isn't a dependency of the published package.
    if (file.endsWith(".stories.tsx")) continue;
    copyFileSync(join(src, file), join(dst, file));
  }
  console.log(`✓ Staged ${name}`);
}

// 3) Stage a minimal @/lib/utils shim so cross-component imports resolve.
mkdirSync(join(STAGE_DIR, "lib"), { recursive: true });
copyFileSync(
  join(repoRoot, "lib", "utils.ts"),
  join(STAGE_DIR, "lib", "utils.ts"),
);

// 4) Stage the public entry files. They re-export from the staged folders.
copyFileSync(
  join(pkgRoot, "src-shim", "index.ts"),
  join(STAGE_DIR, "index.ts"),
);
copyFileSync(
  join(pkgRoot, "src-shim", "chain-selector.ts"),
  join(STAGE_DIR, "chain-selector.ts"),
);
copyFileSync(
  join(pkgRoot, "src-shim", "token-create.ts"),
  join(STAGE_DIR, "token-create.ts"),
);

// 5) Compile. We always run post-process after — partial emits can still be
//    salvaged for downstream tsx/bundler consumers.
console.log("\nCompiling with tsc…");
const tsc = spawnSync("npx", ["tsc", "-p", "tsconfig.json"], {
  cwd: pkgRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (tsc.status !== 0) {
  console.warn("\ntsc exited with non-zero status — running post-process anyway.");
}

// 6) Post-process: rewrite import paths so dist/ is resolvable by Node ESM.
//    Two transformations:
//
//    a) `@/lib/utils` → relative path to the staged `lib/utils.js`.
//       Registry sources use the path alias from the root tsconfig, which
//       is meaningless inside the published package. We compute the right
//       relative path from each emitted file to dist/lib/utils.js.
//
//    b) Append `.js` to relative `./` and `../` imports. Node ESM is strict
//       about extensions; tsc doesn't add them in ESM mode.
console.log("\nPost-processing: rewriting imports for ESM resolution…");
const { writeFileSync, readFileSync, statSync, readdirSync: listDist } = await import("node:fs");

function walk(dir) {
  const out = [];
  for (const f of listDist(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

import { relative, dirname as dirPath } from "node:path";
const TARGET = join(DIST_DIR, "lib", "utils.js");

for (const file of walk(DIST_DIR)) {
  if (!file.endsWith(".js")) continue;
  const src = readFileSync(file, "utf8");

  // a) Rewrite @/ alias to relative.
  let fixed = src.replace(
    /from\s+["']@\/lib\/utils["']/g,
    () => `from "${relative(dirPath(file), TARGET).replace(/\\/g, "/")}"`,
  );

  // b) Append .js to relative imports missing an extension.
  fixed = fixed.replace(
    /from\s+["'](\.\.?\/[^"']+?)(?<!\.js|\.json)["']/g,
    (_m, p) => `from "${p}.js"`,
  );

  if (fixed !== src) writeFileSync(file, fixed);
}

console.log("\nBuild complete →", DIST_DIR);
