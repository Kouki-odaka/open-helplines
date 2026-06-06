# @open-helplines/core

Validator, loader, and TypeScript type definitions for the [open-helplines](https://github.com/Kouki-odaka/open-helplines) registry.

This package is the shared foundation used by `@open-helplines/mcp` and project build tooling. It exposes:

- **Types** — TypeScript interfaces for `HelplineRecord`, `HelplineContact`, and related enums
- **Loader** — reads country data files (JSON / YAML) and returns typed `Result<T>` values
- **ValidatorChain** — composable Chain-of-Responsibility validator pipeline

---

## Installation

```bash
npm install @open-helplines/core
```

---

## API

### Types

```ts
import type {
  HelplineRecord,
  HelplineContact,
  ServiceCategory,
  ContactMethod,
  LanguageCode,
  CountryCode,
  ValidationResult,
  ValidationError,
  Result,
  HelplineDataFile,
} from "@open-helplines/core";
```

Key types:

| Type | Description |
|:-----|:------------|
| `HelplineRecord` | Single verified helpline entry (name, contacts, categories, metadata) |
| `HelplineContact` | One contact method within a record (phone, chat, text, email, app) |
| `ServiceCategory` | `"suicide_prevention" \| "mental_health" \| "domestic_violence" \| ...` |
| `ContactMethod` | `"phone" \| "text" \| "chat" \| "email" \| "app"` |
| `ValidationResult` | `{ valid: boolean; errors: ValidationError[]; warnings: ValidationError[] }` |
| `Result<T>` | `{ ok: true; value: T } \| { ok: false; errors: ValidationError[] }` |
| `HelplineDataFile` | Parsed country data file: `{ country: string; records: HelplineRecord[] }` |

---

### Loader

Load and parse a country data file (JSON or YAML). Returns `Result<T>` instead of throwing.

```ts
import { loadHelplineFile, loadRecords } from "@open-helplines/core";

// Load the full data file
const fileResult = loadHelplineFile("data/countries/jp/helplines.json");
if (fileResult.ok) {
  console.log(fileResult.value.country);   // "JP"
  console.log(fileResult.value.records);   // HelplineRecord[]
} else {
  console.error(fileResult.errors);        // ValidationError[]
}

// Convenience: load records directly
const recordsResult = loadRecords("data/countries/us/helplines.json");
if (recordsResult.ok) {
  const records: HelplineRecord[] = recordsResult.value;
}
```

Supported formats: `.json`, `.yaml`, `.yml`

---

### ValidatorChain

Composable validator pipeline. Implement the `Validator` interface and chain validators together.

```ts
import {
  ValidatorChain,
  loadRecords,
} from "@open-helplines/core";
import type { Validator, ValidationResult } from "@open-helplines/core";
import type { HelplineRecord } from "@open-helplines/core";

// Implement a custom validation rule
const phoneFormatValidator: Validator = {
  name: "phone-format",
  validate(record: HelplineRecord): ValidationResult {
    const errors = record.contacts
      .filter(c => c.method === "phone" && !c.number?.startsWith("+"))
      .map(c => ({
        path: "/contacts",
        code: "PHONE_NOT_E164",
        message: `Phone number must be in E.164 format`,
        severity: "error" as const,
      }));
    return { valid: errors.length === 0, errors, warnings: [] };
  },
};

// Build a pipeline with multiple validators
const chain = new ValidatorChain()
  .add(phoneFormatValidator);

// Validate a single record
const result = chain.validate(record);
if (!result.valid) {
  console.error(result.errors);   // ValidationError[]
}

// Validate a batch of records
const recordsResult = loadRecords("data/countries/jp/helplines.json");
if (recordsResult.ok) {
  const results = chain.validateBatch(recordsResult.value);
  const failedCount = results.filter(r => !r.valid).length;
}
```

---

## License

- Code: [Apache-2.0](./LICENSE)
- Data (`data/` directory): [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

---

## Links

- [GitHub Repository](https://github.com/Kouki-odaka/open-helplines)
- [Registry Visualization](https://kouki-odaka.github.io/open-helplines/en/)
- [`@open-helplines/mcp`](https://www.npmjs.com/package/@open-helplines/mcp) — MCP server using this package
