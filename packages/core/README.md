# @open-helplines/core

Validator, builder, and TypeScript type definitions for the [open-helplines](https://github.com/Kouki-odaka/open-helplines) registry.

This package is the shared foundation used by `@open-helplines/mcp` and project build tooling. It exposes:

- **Types** — TypeScript interfaces for `HelplineRecord`, `HelplineContact`, and related enums
- **Validator** — JSON Schema + business-rule validation for helpline data files
- **Builder** — Compiles country data files into a distributable index

---

## Installation

```bash
npm install @open-helplines/core
```

---

## API

### Types (`HelplineRecord` and friends)

```ts
import type {
  HelplineRecord,
  HelplineContact,
  ServiceCategory,
  ContactMethod,
  LanguageCode,
  CountryCode,
} from "@open-helplines/core";
```

Key types:

| Type | Description |
|:-----|:------------|
| `HelplineRecord` | Single verified helpline entry (name, contacts, categories, metadata) |
| `HelplineContact` | One contact method within a record (phone, chat, text, email, app) |
| `ServiceCategory` | Enum: `"suicide_prevention" \| "mental_health" \| "domestic_violence" \| ...` |
| `ContactMethod` | Enum: `"phone" \| "text" \| "chat" \| "email" \| "app"` |
| `LanguageCode` | BCP-47 string, e.g. `"en"`, `"ja"`, `"fr-CA"` |
| `CountryCode` | ISO 3166-1 alpha-2 string, e.g. `"JP"`, `"US"` |

---

### Validator

```ts
import {
  HelplineValidator,
  ValidatorChain,
  loadHelplineFile,
  loadRecords,
} from "@open-helplines/core";
import type {
  ValidationResult,
  ValidationError,
  HelplineDataFile,
} from "@open-helplines/core";

// Load a country data file
const file: HelplineDataFile = loadHelplineFile("data/countries/jp/helplines.json");
const records = loadRecords(file);

// Validate a single record
const validator = new HelplineValidator();
const result: ValidationResult = validator.validate(records[0]);
if (!result.ok) {
  console.error(result.errors); // ValidationError[]
}
```

---

### Builder

```ts
import { DistBuilder } from "@open-helplines/core";

const builder = new DistBuilder({ dataDir: "data/countries" });
await builder.build();
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
