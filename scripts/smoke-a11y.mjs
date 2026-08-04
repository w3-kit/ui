// Smoke test: render every accessible state of TokenCreate + ChainSelector
// and run axe-core on each one.
//
// Run with: `npx tsx scripts/smoke-a11y.mjs`
//
// Limitation: only static HTML is examined (no event simulation). It catches
// ARIA wiring mistakes (missing labels, wrong roles, missing button text)
// which is most of what you'd fail axe on by default.

import { JSDOM } from "jsdom";

// Wire up JSDOM BEFORE loading React. The wrapped HTML is representative of
// a real consumer's <html>: lang set, title set, body present. axe checks
// those out-of-the-box.
const dom = new JSDOM(
  '<!doctype html><html lang="en"><head><title>Token create</title></head><body></body></html>',
  { url: "http://localhost/", pretendToBeVisual: true },
);

const w = dom.window;
for (const k of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLAnchorElement",
  "Element",
  "Node",
  "getComputedStyle",
  "CSS",
  "DOMParser",
  "NodeFilter",
]) {
  Object.defineProperty(globalThis, k, {
    configurable: true,
    writable: true,
    value: w[k],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  writable: true,
  value: w.navigator,
});

// JSDOM doesn't ship canvas; axe probes it for color-contrast checks.
// Stubs that return undefined so axe skips the rule gracefully.
Object.defineProperty(w.HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  writable: true,
  value: () => null,
});

const axe = await import("axe-core");

const React = (await import("react")).default ?? (await import("react"));
const ReactDOMServer = (await import("react-dom/server")).default;

const { ChainSelector } = await import("../registry/w3-kit/chain-selector/chain-selector.tsx");
const { TokenCreate } = await import("../registry/w3-kit/token-create/token-create.tsx");

async function runAxe(label) {
  const results = await axe.default.run(globalThis.document, {
    resultTypes: ["violations"],
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
  });
  const critical = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  if (critical.length > 0) {
    console.error(`\n[FAIL] ${label}:`);
    for (const v of critical) {
      console.error(`  - ${v.id} (${v.impact}): ${v.help}`);
      console.error(
        `    nodes: ${v.nodes
          .slice(0, 3)
          .map((n) => n.target.join(" "))
          .join(" | ")}`,
      );
    }
    return false;
  }
  console.log(`[ OK ] ${label}`);
  return true;
}

function renderToBody(element) {
  globalThis.document.body.innerHTML = "";
  const html = ReactDOMServer.renderToStaticMarkup(element);
  globalThis.document.body.innerHTML = html;
}

const chains = [
  {
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    color: "#627eea",
    ecosystem: "evm",
    currency: "ETH",
    explorerHost: "etherscan.io",
  },
  {
    chainId: 137,
    name: "Polygon",
    symbol: "MATIC",
    color: "#8247e5",
    ecosystem: "evm",
    currency: "MATIC",
    explorerHost: "polygonscan.com",
  },
  {
    chainId: "mainnet-beta",
    name: "Solana",
    symbol: "SOL",
    color: "#9945ff",
    ecosystem: "solana",
    currency: "SOL",
    explorerHost: "solscan.io",
  },
];

const cases = [
  [
    "ChainSelector (basic)",
    React.createElement(ChainSelector, {
      chains,
      onSelect: () => {},
    }),
  ],
  [
    "ChainSelector (searchable + selected)",
    React.createElement(ChainSelector, {
      chains,
      selectedChainId: 1,
      searchable: true,
      showTestnetToggle: true,
      onSelect: () => {},
    }),
  ],
  [
    "TokenCreate (idle, chain step)",
    React.createElement(TokenCreate, {
      chains,
      onDeploy: async () => ({
        address: "0xAbcdef0000000000000000000000000000000001",
        txHash: "0xfeed00000000000000000000000000000000000000000000000000000000",
      }),
    }),
  ],
];

let allOk = true;
for (const [label, el] of cases) {
  try {
    renderToBody(el);
    allOk = (await runAxe(label)) && allOk;
  } catch (err) {
    console.error(`[ERR ] ${label}: ${err.stack || err.message}`);
    allOk = false;
  }
}

// Verify the form-level components independently. They take props that
// the public TokenCreate builds, but we test them in isolation because
// they're the load-bearing ARIA surface.
const { EvmTokenForm } = await import("../registry/w3-kit/token-create/evm-token-form.tsx");
const { SolanaTokenForm } = await import("../registry/w3-kit/token-create/solana-token-form.tsx");
const { ResultCard } = await import("../registry/w3-kit/token-create/result-card.tsx");

const evmErrors = [{ field: "name", message: "Name is required." }];

const extraCases = [
  [
    "EvmTokenForm (with errors)",
    React.createElement(EvmTokenForm, {
      value: {
        name: "",
        symbol: "MTK",
        decimals: 18,
        initialSupply: "1000",
        mintable: true,
        burnable: false,
      },
      onChange: () => {},
      errors: evmErrors,
    }),
  ],
  [
    "SolanaTokenForm (clean)",
    React.createElement(SolanaTokenForm, {
      value: {
        name: "Demo Token",
        symbol: "DEMO",
        decimals: 9,
        initialSupply: "1000000",
        mintAuthority: "renounced",
      },
      onChange: () => {},
    }),
  ],
  [
    "ResultCard (with deploy result)",
    React.createElement(ResultCard, {
      chain: chains[0],
      result: {
        address: "0xAbcdef0000000000000000000000000000000001",
        txHash: "0xfeed00000000000000000000000000000000000000000000000000000000",
      },
    }),
  ],
];

for (const [label, el] of extraCases) {
  try {
    renderToBody(el);
    allOk = (await runAxe(label)) && allOk;
  } catch (err) {
    console.error(`[ERR ] ${label}: ${err.stack || err.message}`);
    allOk = false;
  }
}

process.exit(allOk ? 0 : 1);
