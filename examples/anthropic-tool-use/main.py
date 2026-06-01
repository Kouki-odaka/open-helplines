"""
open-helplines × Anthropic tool use

Demonstrates how to let Claude look up verified crisis lines using
open-helplines data via Anthropic's tool-use API.

Run:
    pip install anthropic httpx
    ANTHROPIC_API_KEY=sk-ant-... python main.py
"""

import json
import os
from typing import Any

import anthropic
import httpx

REGISTRY_BASE = (
    "https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data"
)

# ---------------------------------------------------------------------------
# Registry access
# ---------------------------------------------------------------------------


def find_helplines(country: str, category: str | None = None) -> list[dict[str, Any]]:
    """
    Fetch helpline records for a country from the open-helplines registry.
    Returns verified records; never generates or infers contact information.
    """
    cc = country.lower()
    url = f"{REGISTRY_BASE}/countries/{cc}/index.json"

    try:
        response = httpx.get(url, timeout=10)
        response.raise_for_status()
    except httpx.HTTPStatusError:
        # Country not yet in registry
        return []

    records: list[dict[str, Any]] = response.json()

    if category:
        records = [
            r
            for r in records
            if r.get("category") == category
            or category in (r.get("secondary_categories") or [])
        ]

    # Return only the fields needed by the model — avoids accidental leakage of
    # internal metadata and keeps tool responses compact.
    return [
        {
            "id": r["id"],
            "name": r["name"],
            "local_name": r.get("local_name"),
            "category": r["category"],
            "contacts": r["contacts"],
            "description": r["description"],
            "verified_at": r["verified_at"],
        }
        for r in records
    ]


# ---------------------------------------------------------------------------
# Tool definition for Anthropic
# ---------------------------------------------------------------------------

TOOLS: list[anthropic.types.ToolParam] = [
    {
        "name": "find_helplines",
        "description": (
            "Return verified crisis hotlines and mental health contact services for a given country. "
            "Phone numbers and URLs are verbatim from the registry — never paraphrase or generate them."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "country": {
                    "type": "string",
                    "description": "ISO 3166-1 alpha-2 country code (e.g. 'JP', 'US', 'AU')",
                },
                "category": {
                    "type": "string",
                    "description": (
                        "Filter by category. One of: suicide_prevention, mental_health, "
                        "domestic_violence, sexual_violence, substance_abuse, youth, lgbtq, "
                        "veterans, elder, grief, general_crisis, other"
                    ),
                },
            },
            "required": ["country"],
        },
    }
]


# ---------------------------------------------------------------------------
# Tool execution dispatcher
# ---------------------------------------------------------------------------


def execute_tool(name: str, input_data: dict[str, Any]) -> str:
    if name == "find_helplines":
        records = find_helplines(
            country=input_data["country"],
            category=input_data.get("category"),
        )
        return json.dumps(records, ensure_ascii=False, indent=2)

    raise ValueError(f"Unknown tool: {name!r}")


# ---------------------------------------------------------------------------
# Main conversation loop (agentic loop)
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = (
    "You are a helpful assistant that finds verified mental health crisis resources. "
    "When you retrieve helpline records, present the phone number and URL EXACTLY as returned "
    "from the tool — do not paraphrase, abbreviate, or generate contact information. "
    "Always remind users that if there is an immediate risk to life, emergency services "
    "(such as 119/110 in Japan, 911 in the US) should be called first."
)


def main() -> None:
    client = anthropic.Anthropic()

    messages: list[anthropic.types.MessageParam] = [
        {
            "role": "user",
            "content": (
                "I'm building a mental health app for Australia. "
                "Can you give me the verified crisis helpline records for AU?"
            ),
        }
    ]

    while True:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

        # Append assistant turn
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason != "tool_use":
            # Final text response
            for block in response.content:
                if hasattr(block, "text"):
                    print(block.text)
            break

        # Execute all tool calls and collect results
        tool_results: list[anthropic.types.ToolResultBlockParam] = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)  # type: ignore[arg-type]
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    }
                )

        messages.append({"role": "user", "content": tool_results})


if __name__ == "__main__":
    main()
