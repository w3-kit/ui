import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { MetadataResolver } from "./resolver.js";
import { handleListComponents } from "./tools/list-components.js";
import { handleGetComponent } from "./tools/get-component.js";
import { handleGetDesignTokens } from "./tools/get-design-tokens.js";
import { handleGetDesignGuidelines } from "./tools/get-design-guidelines.js";
import { handleGenerateComposition } from "./tools/generate-composition.js";
import { handleGetExample } from "./tools/get-example.js";

export function createServer(resolver: MetadataResolver): McpServer {
  const server = new McpServer({
    name: "w3-kit",
    version: "0.1.0",
  });

  server.tool(
    "list_components",
    "List all w3-kit components, optionally filtered by category (token, nft, wallet, defi, utility, general)",
    { category: z.string().optional() },
    async (args) => handleListComponents(resolver, args),
  );

  server.tool(
    "get_component",
    "Get full details for a w3-kit component: props, types, source code, and dependencies",
    { name: z.string() },
    async (args) => handleGetComponent(resolver, args),
  );

  server.tool(
    "get_design_tokens",
    "Get w3-kit design tokens extracted from Tailwind config: colors, spacing, typography",
    { section: z.enum(["colors", "spacing", "typography", "all"]).optional() },
    async (args) => handleGetDesignTokens(resolver, args),
  );

  server.tool(
    "get_design_guidelines",
    "Get w3-kit design guidelines by topic: spacing, hierarchy, dark-mode, motion, vercel-style",
    {
      topic: z
        .enum(["spacing", "hierarchy", "dark-mode", "motion", "vercel-style", "all"])
        .optional(),
    },
    async (args) => handleGetDesignGuidelines(resolver, args),
  );

  server.tool(
    "generate_composition",
    "Generate a page or section composing multiple w3-kit components together",
    {
      description: z.string(),
      components: z.array(z.string()).optional(),
    },
    async (args) => handleGenerateComposition(resolver, args),
  );

  server.tool(
    "get_example",
    "Get a usage code example for a w3-kit component",
    {
      name: z.string(),
      variant: z.enum(["basic", "full"]).optional(),
    },
    async (args) => handleGetExample(resolver, args),
  );

  return server;
}
