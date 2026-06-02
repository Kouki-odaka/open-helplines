// SPDX-License-Identifier: Apache-2.0
/**
 * @open-helplines/mcp — MCP server with Safe Answer guardrails.
 *
 * Exported tools: find_helplines, list_countries, get_helpline_by_id
 * Guardrails: staleness check | misroute prevention | fallback chain
 *             | mandatory citation | hallucination refusal (DATA_NOT_FOUND)
 */

export { createServer, startServer } from "./server.js";
export { HelplinesRegistry, getRegistry, resetRegistry } from "./registry.js";
export {
  checkStaleness,
  checkCountryMismatch,
  buildCitation,
  applyGuardrails,
  findNearbyFallback,
  getInternationalFallbacks,
} from "./guardrails.js";
export type {
  Citation,
  DataNotFoundResult,
  FindHelplinesResult,
  GetHelplineByIdResult,
  GuardedHelplineRecord,
  GuardrailWarning,
  UrlStatus,
  WarningCode,
} from "./types.js";
