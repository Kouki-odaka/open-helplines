# open-helplines MCP — Claude Desktop setup

This example shows how to connect the open-helplines MCP server to Claude Desktop,
giving Claude direct access to the verified helpline registry via tool calls.

## Prerequisites

- [Claude Desktop](https://claude.ai/download) installed
- Node.js 18 or later

## 1. Install the MCP server

```sh
npm install -g @open-helplines/mcp
```

Or use `npx` directly (no global install needed — see step 2).

## 2. Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "open-helplines": {
      "command": "npx",
      "args": ["@open-helplines/mcp"]
    }
  }
}
```

Restart Claude Desktop. The helplines tools appear automatically in the tool panel.

## Available tools

| Tool | Description |
|------|-------------|
| `find_helplines` | Search by country (ISO alpha-2) and optional category |
| `list_countries` | List all countries with coverage and record counts |
| `get_helpline_by_id` | Fetch a single record by its unique ID (e.g. `jp-inochi-no-denwa`) |

## Example prompts

Once configured, try these prompts in Claude Desktop:

```
What crisis lines are available in Japan for suicide prevention?
```

```
List all countries in the open-helplines registry.
```

```
Get the full record for jp-inochi-no-denwa.
```

## Safety note

The MCP server returns contact information verbatim from the registry.
Claude is instructed not to paraphrase or generate phone numbers.
If a user appears to be in crisis, the system prompt in Claude Desktop
should direct them to local emergency services before any registry lookup.

## Data freshness

The registry includes a `verified_at` date on every record.
Claude Desktop will display this date so users can judge data freshness.
All records are re-verified at least annually; records older than 24 months
are removed automatically.
