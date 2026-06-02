#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
/**
 * CLI entrypoint — starts the Open-Helplines MCP server over stdio transport.
 * Used by Claude Desktop, Cline, and other MCP clients.
 *
 * Usage:
 *   npx @open-helplines/mcp
 *   # or in Claude Desktop config:
 *   # { "command": "npx", "args": ["@open-helplines/mcp"] }
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    "[open-helplines-mcp] Server started (stdio). Safe Answer guardrails enabled.\n",
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `[open-helplines-mcp] Fatal error: ${String(error)}\n`,
  );
  process.exit(1);
});
