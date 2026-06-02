// SPDX-License-Identifier: Apache-2.0
/**
 * HelplinesRegistry — loads all country data files and provides lookup methods.
 * Scans data/countries/<cc>/helplines.json relative to the repository root.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { HelplineRecord } from "@open-helplines/core";

// ---------------------------------------------------------------------------
// Path resolution (ESM __dirname equivalent)
// ---------------------------------------------------------------------------

const PACKAGE_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = resolve(PACKAGE_DIR, "../../..");
const COUNTRIES_DIR = join(REPO_ROOT, "data", "countries");
const URL_HEALTH_FILE = join(REPO_ROOT, "data", "index", "url-health.json");

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function loadCountryFile(countryDir: string): HelplineRecord[] {
  const filePath = join(countryDir, "helplines.json");
  if (!existsSync(filePath)) return [];
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as { records: HelplineRecord[] };
  return Array.isArray(parsed.records) ? parsed.records : [];
}

function scanCountryDirectories(): string[] {
  if (!existsSync(COUNTRIES_DIR)) return [];
  return readdirSync(COUNTRIES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name.toUpperCase());
}

function loadUrlHealthIndex(): Record<string, string> {
  if (!existsSync(URL_HEALTH_FILE)) return {};
  const raw = readFileSync(URL_HEALTH_FILE, "utf8");
  return JSON.parse(raw) as Record<string, string>;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export class HelplinesRegistry {
  private readonly recordsByCountry: Map<string, HelplineRecord[]>;
  private readonly recordsById: Map<string, HelplineRecord>;
  private readonly urlHealthIndex: Record<string, string>;

  constructor() {
    this.recordsByCountry = new Map();
    this.recordsById = new Map();
    this.urlHealthIndex = loadUrlHealthIndex();
    this.loadAllCountries();
  }

  private loadAllCountries(): void {
    for (const countryCode of scanCountryDirectories()) {
      const dirPath = join(COUNTRIES_DIR, countryCode.toLowerCase());
      const records = loadCountryFile(dirPath);
      this.recordsByCountry.set(countryCode, records);
      for (const record of records) {
        this.recordsById.set(record.id, record);
      }
    }
  }

  /** Returns records for a country, or null if country is unknown. */
  getByCountry(countryCode: string): HelplineRecord[] | null {
    const upper = countryCode.toUpperCase();
    return this.recordsByCountry.has(upper)
      ? (this.recordsByCountry.get(upper) ?? [])
      : null;
  }

  /** Returns a single record by its slug ID, or null if not found. */
  getById(id: string): HelplineRecord | null {
    return this.recordsById.get(id) ?? null;
  }

  /** Returns all known ISO 3166-1 alpha-2 country codes (uppercase). */
  listCountries(): string[] {
    return [...this.recordsByCountry.keys()].sort();
  }

  /** Returns the URL health status for a given source URL. */
  getUrlStatus(sourceUrl: string): string {
    return this.urlHealthIndex[sourceUrl] ?? "unchecked";
  }

  /** Total number of records across all countries. */
  get totalRecords(): number {
    let count = 0;
    for (const records of this.recordsByCountry.values()) {
      count += records.length;
    }
    return count;
  }
}

// ---------------------------------------------------------------------------
// Singleton for server use (lazy-loaded)
// ---------------------------------------------------------------------------

let _registry: HelplinesRegistry | null = null;

export function getRegistry(): HelplinesRegistry {
  if (!_registry) {
    _registry = new HelplinesRegistry();
  }
  return _registry;
}

/** Reset singleton — for testing only */
export function resetRegistry(): void {
  _registry = null;
}
