#!/usr/bin/env python3
"""
generate_python_models.py

Generates Pydantic v2 models from schemas/helpline.schema.json.
Output: packages/python/open_helplines/generated.py

Run: npm run build:types:python  (or: python3 scripts/generate_python_models.py)
Requires: datamodel-code-generator (pip install datamodel-code-generator)
"""

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
SCHEMA = REPO_ROOT / "schemas" / "helpline.schema.json"
OUTPUT = REPO_ROOT / "packages" / "python" / "open_helplines" / "generated.py"


def main() -> None:
    try:
        subprocess.run(["datamodel-codegen", "--version"], check=True, capture_output=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        print(
            "datamodel-code-generator not found.\n"
            "Install: pip install 'datamodel-code-generator[http]'",
            file=sys.stderr,
        )
        sys.exit(1)

    cmd = [
        "datamodel-codegen",
        "--input", str(SCHEMA),
        "--input-file-type", "jsonschema",
        "--output", str(OUTPUT),
        "--output-model-type", "pydantic_v2.BaseModel",
        "--field-constraints",
        "--strict-nullable",
        "--use-annotated",
        "--use-double-quotes",
        "--target-python-version", "3.10",
        "--custom-file-header",
        "# AUTO-GENERATED — do not edit manually.\n"
        "# Source: schemas/helpline.schema.json\n"
        "# Regenerate: python3 scripts/generate_python_models.py\n",
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error generating models:\n{result.stderr}", file=sys.stderr)
        sys.exit(result.returncode)

    print(f"✓ Generated Pydantic models → {OUTPUT}")


if __name__ == "__main__":
    main()
