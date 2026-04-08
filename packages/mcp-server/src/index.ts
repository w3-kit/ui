#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MetadataResolver } from "./resolver.js";
import { createServer } from "./server.js";

const dev = process.argv.includes("--dev");
const resolver = MetadataResolver.create(dev);
const server = createServer(resolver);
const transport = new StdioServerTransport();

await server.connect(transport);
