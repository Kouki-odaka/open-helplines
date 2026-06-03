// SPDX-License-Identifier: Apache-2.0
/**
 * Open-Helplines MCP server — Safe Answer guardrails enabled.
 *
 * Tools:
 *   - find_helplines       : Search helplines by country (+ optional category)
 *   - list_countries       : List all countries in the registry
 *   - get_helpline_by_id   : Fetch a single helpline by its unique slug ID
 *
 * All tools apply guardrails: staleness checks, misroute prevention,
 * fallback chains, mandatory citation, and hallucination refusal.
 */

import * as z from "zod/v4";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { HelplineRecord } from "@open-helplines/core";
import { getRegistry } from "./registry.js";
import {
  applyGuardrails,
  findNearbyFallback,
  getInternationalFallbacks,
} from "./guardrails.js";
import type {
  DataNotFoundResult,
  FindHelplinesResult,
  GetHelplineByIdResult,
  GuardedHelplineRecord,
} from "./types.js";

const SERVER_NAME = "open-helplines";
const SERVER_VERSION = "0.2.0";

// ---------------------------------------------------------------------------
// Tool descriptions (guardrails enabled badge)
// ---------------------------------------------------------------------------

const FIND_HELPLINES_DESC = [
  "[guardrails enabled] Search helplines by country code (ISO 3166-1 alpha-2).",
  "Returns verified helpline records with mandatory citation metadata.",
  "Applies staleness warnings, cross-country misroute prevention, and",
  "fallback to nearby countries or IASP/Befrienders if none found.",
  "Returns DATA_NOT_FOUND sentinel when no registry entry exists — never hallucinate.",
].join(" ");

const LIST_COUNTRIES_DESC =
  "[guardrails enabled] List all country codes that have helpline data in the registry.";

const GET_BY_ID_DESC = [
  "[guardrails enabled] Fetch a single helpline record by its unique slug ID",
  "(e.g. 'jp-inochi-no-denwa'). Returns DATA_NOT_FOUND sentinel if not in registry.",
].join(" ");

// ---------------------------------------------------------------------------
// Result serialisation helpers
// ---------------------------------------------------------------------------

function serializeResult(result: unknown): string {
  return JSON.stringify(result, null, 2);
}

function dataNotFound(reason: string): DataNotFoundResult {
  return { sentinel: "DATA_NOT_FOUND", reason, hint: "not in registry" };
}

// ---------------------------------------------------------------------------
// Guardrail application with fallback chain
// ---------------------------------------------------------------------------

function buildFindResult(
  records: HelplineRecord[],
  requestedCountry: string,
  isFallback: boolean,
  fallbackType: "nearby" | "international" | null,
): FindHelplinesResult {
  const registry = getRegistry();
  const guarded = applyGuardrails(
    records,
    requestedCountry,
    (url) => registry.getUrlStatus(url),
  );

  if (isFallback && fallbackType === "nearby") {
    for (const record of guarded) {
      record.warnings.push({
        code: "FALLBACK_USED",
        message: `FALLBACK_USED: No data for ${requestedCountry}. Showing nearby country records.`,
      });
    }
  }

  if (isFallback && fallbackType === "international") {
    for (const record of guarded) {
      record.warnings.push({
        code: "FALLBACK_INTERNATIONAL",
        message:
          `FALLBACK_INTERNATIONAL: No local or nearby data for ${requestedCountry}.` +
          " Showing international directories (IASP/Befrienders).",
      });
    }
  }

  return { found: true, records: guarded, total: guarded.length };
}

type CountryRecordsResult = {
  records: HelplineRecord[];
  isFallback: boolean;
  fallbackType: "nearby" | "international" | null;
};

/**
 * Resolve records for a country, applying the fallback chain.
 * Returns null when the country is not in the registry at all —
 * the caller should return a DATA_NOT_FOUND sentinel rather than hallucinate.
 *
 * @internal — exported for unit testing only
 */
export function resolveCountryRecords(
  requestedCountry: string,
): CountryRecordsResult | null {
  const registry = getRegistry();
  const direct = registry.getByCountry(requestedCountry);

  // Country not in registry at all — signal DATA_NOT_FOUND to caller
  if (direct === null) {
    return null;
  }

  if (direct.length > 0) {
    return { records: direct, isFallback: false, fallbackType: null };
  }

  const nearby = findNearbyFallback(registry, requestedCountry);
  if (nearby.length > 0) {
    return { records: nearby, isFallback: true, fallbackType: "nearby" };
  }

  return {
    records: getInternationalFallbacks(),
    isFallback: true,
    fallbackType: "international",
  };
}

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

/** @internal — exported for unit testing only */
export function handleFindHelplines(args: {
  country: string;
  category?: string | undefined;
  limit?: number | undefined;
}): FindHelplinesResult {
  const { country, category, limit = 10 } = args;

  const resolved = resolveCountryRecords(country);

  // Country is not in the registry — refuse to hallucinate
  if (resolved === null) {
    return dataNotFound(
      `Country '${country}' is not in the registry. Use list_countries to see supported codes.`,
    );
  }

  const { records, isFallback, fallbackType } = resolved;

  const filtered = category
    ? records.filter(
        (r) =>
          r.category === category ||
          r.secondary_categories?.includes(category as never),
      )
    : records;

  const sliced = filtered.slice(0, Math.min(limit, 50));

  if (sliced.length === 0) {
    return dataNotFound(
      `No helplines found for country='${country}'` +
        (category ? ` category='${category}'` : "") +
        ". Consider broadening the search.",
    );
  }

  return buildFindResult(sliced, country, isFallback, fallbackType);
}

function handleGetHelplineById(args: { id: string }): GetHelplineByIdResult {
  const registry = getRegistry();
  const record = registry.getById(args.id);

  if (!record) {
    return dataNotFound(
      `No helpline found with id='${args.id}'. Use find_helplines to discover valid IDs.`,
    );
  }

  const guarded: GuardedHelplineRecord[] = applyGuardrails(
    [record],
    record.country,
    (url) => registry.getUrlStatus(url),
  );

  return { found: true, record: guarded[0]! };
}

function handleListCountries(): {
  countries: string[];
  total: number;
  note: string;
} {
  const registry = getRegistry();
  return {
    countries: registry.listCountries(),
    total: registry.listCountries().length,
    note: "Use country codes with find_helplines. DATA_NOT_FOUND is returned for unlisted codes.",
  };
}

// ---------------------------------------------------------------------------
// Server factory
// ---------------------------------------------------------------------------

export function createServer(): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        "Open-Helplines MCP server provides verified crisis helpline data. " +
        "All tools have guardrails enabled. Never supplement with LLM knowledge — " +
        "return DATA_NOT_FOUND sentinel when data is not in the registry.",
    },
  );

  server.registerTool(
    "find_helplines",
    {
      title: "Find Helplines",
      description: FIND_HELPLINES_DESC,
      inputSchema: {
        country: z
          .string()
          .min(2)
          .max(2)
          .describe("ISO 3166-1 alpha-2 country code (uppercase), e.g. 'JP'"),
        category: z
          .string()
          .optional()
          .describe(
            "Service category filter: suicide_prevention | mental_health | " +
              "domestic_violence | sexual_violence | substance_abuse | youth | " +
              "lgbtq | veterans | elder | grief | general_crisis | other",
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .default(10)
          .describe("Maximum number of records to return (default 10, max 50)"),
      },
    },
    (args) => {
      const result = handleFindHelplines(args);
      return { content: [{ type: "text", text: serializeResult(result) }] };
    },
  );

  server.registerTool(
    "list_countries",
    {
      title: "List Countries",
      description: LIST_COUNTRIES_DESC,
    },
    () => {
      const result = handleListCountries();
      return { content: [{ type: "text", text: serializeResult(result) }] };
    },
  );

  server.registerTool(
    "get_helpline_by_id",
    {
      title: "Get Helpline by ID",
      description: GET_BY_ID_DESC,
      inputSchema: {
        id: z
          .string()
          .describe(
            "Unique helpline slug ID, e.g. 'jp-inochi-no-denwa'. " +
              "Use find_helplines first to discover valid IDs.",
          ),
      },
    },
    (args) => {
      const result = handleGetHelplineById(args);
      return { content: [{ type: "text", text: serializeResult(result) }] };
    },
  );

  return server;
}

export function startServer(): never {
  // CLI entry point is in cli.ts — this is a placeholder for type compatibility
  throw new Error("Use cli.ts to start the server via stdio transport");
}
