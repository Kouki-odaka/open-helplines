// SPDX-License-Identifier: Apache-2.0

/**
 * Loader — reads a country data file (JSON or YAML) and returns HelplineRecord[].
 *
 * Returns Result<T> instead of throwing so callers can handle errors structurally.
 * Supports both .json and .yaml/.yml extensions.
 */

import { readFileSync } from "node:fs";
import { extname } from "node:path";
import { load as parseYaml } from "js-yaml";
import type { HelplineRecord } from "../types/helpline.js";
import type { Result, ValidationError } from "./types.js";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface HelplineDataFile {
  $schema?: string;
  country: string;
  records: HelplineRecord[];
}

/** Load and parse a single country data file. Supports .json, .yaml, .yml */
export function loadHelplineFile(filePath: string): Result<HelplineDataFile> {
  const raw = readRawFile(filePath);
  if (!raw.ok) return raw;

  const parsed = parseFileContent(raw.value, filePath);
  if (!parsed.ok) return parsed;

  const validated = assertDataFileShape(parsed.value);
  if (!validated.ok) return validated;

  return { ok: true, value: validated.value };
}

/** Load all records from a data file (convenience wrapper) */
export function loadRecords(filePath: string): Result<HelplineRecord[]> {
  const result = loadHelplineFile(filePath);
  if (!result.ok) return result;
  return { ok: true, value: result.value.records };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function readRawFile(filePath: string): Result<string> {
  try {
    return { ok: true, value: readFileSync(filePath, "utf8") };
  } catch (error) {
    return fileError(
      "FILE_READ_ERROR",
      `Cannot read file "${filePath}": ${errorMessage(error)}`,
    );
  }
}

function parseFileContent(content: string, filePath: string): Result<unknown> {
  const extension = extname(filePath).toLowerCase();

  try {
    if (extension === ".json") {
      return { ok: true, value: JSON.parse(content) };
    }
    if (extension === ".yaml" || extension === ".yml") {
      return { ok: true, value: parseYaml(content) };
    }
    return fileError(
      "UNSUPPORTED_FORMAT",
      `Unsupported file extension "${extension}". Expected .json, .yaml, or .yml`,
    );
  } catch (error) {
    return fileError(
      "FILE_PARSE_ERROR",
      `Failed to parse "${filePath}": ${errorMessage(error)}`,
    );
  }
}

function assertDataFileShape(value: unknown): Result<HelplineDataFile> {
  if (
    typeof value !== "object" ||
    value === null ||
    !("country" in value) ||
    !("records" in value) ||
    !Array.isArray((value as { records: unknown }).records)
  ) {
    return fileError(
      "INVALID_FILE_STRUCTURE",
      "Data file must contain 'country' (string) and 'records' (array) fields",
    );
  }
  return { ok: true, value: value as HelplineDataFile };
}

function fileError(code: string, message: string): Result<never> {
  const error: ValidationError = { path: "/", code, message, severity: "error" };
  return { ok: false, errors: [error] };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
