# @w3-kit/mcp

MCP (Model Context Protocol) server for the [w3-kit](https://w3-kit.com) Web3 component library. Gives AI coding assistants full knowledge of w3-kit's 27 components, design tokens, guidelines, and composition patterns.

## Quick Setup

Add to your `.mcp.json` (Claude Code, Cursor, etc.):

```json
{
  "mcpServers": {
    "w3-kit": {
      "command": "npx",
      "args": ["@w3-kit/mcp"]
    }
  }
}
```

## Available Tools

| Tool                    | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `list_components`       | List all w3-kit components, filter by category       |
| `get_component`         | Get props, types, source code for a component        |
| `get_design_tokens`     | Get colors, spacing, typography from Tailwind config |
| `get_design_guidelines` | Get design rules (spacing, dark mode, Vercel style)  |
| `generate_composition`  | Generate a page composing multiple components        |
| `get_example`           | Get basic or full usage examples                     |

## Categories

Components are organized into: **token**, **nft**, **wallet**, **defi**, **utility**, **general**

```
list_components({ category: "defi" })
get_component({ name: "token-card" })
generate_composition({ description: "token swap with gas estimation" })
```

## Development Mode

For contributors working on w3-kit itself:

```json
{
  "mcpServers": {
    "w3-kit": {
      "command": "node",
      "args": ["ui/packages/mcp-server/dist/index.js", "--dev"]
    }
  }
}
```

Dev mode reads live source files instead of the bundled metadata.

## Links

- [Documentation](https://w3-kit.com/docs/mcp)
- [w3-kit Components](https://w3-kit.com)
- [GitHub](https://github.com/AnonimRosul/w3-kit)
