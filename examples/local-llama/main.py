"""
open-helplines × Ollama (local LLM)

Demonstrates how to query verified helpline data and inject it into
a local LLM conversation using Ollama's OpenAI-compatible API.
No external API key needed — data and inference both run locally.

Requirements:
    pip install openai httpx
    ollama pull llama3.2   # or any tool-capable model

Run:
    python main.py
"""

import json
from typing import Any

import httpx
from openai import OpenAI  # Ollama's OpenAI-compatible endpoint

REGISTRY_BASE = (
    "https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data"
)

# Ollama runs at localhost:11434 and exposes an OpenAI-compatible API.
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # required by the SDK, value is ignored by Ollama
)

# ---------------------------------------------------------------------------
# Registry fetch — no API key, CC0 data
# ---------------------------------------------------------------------------


def find_helplines(country: str, category: str | None = None) -> list[dict[str, Any]]:
    """Fetch verified helpline records from the open-helplines registry."""
    cc = country.lower()
    url = f"{REGISTRY_BASE}/countries/{cc}/index.json"

    try:
        response = httpx.get(url, timeout=10)
        response.raise_for_status()
    except httpx.HTTPStatusError:
        return []

    records: list[dict[str, Any]] = response.json()

    if category:
        records = [
            r
            for r in records
            if r.get("category") == category
            or category in (r.get("secondary_categories") or [])
        ]

    return records


# ---------------------------------------------------------------------------
# Tool definition (OpenAI-compatible schema)
# ---------------------------------------------------------------------------

tools = [
    {
        "type": "function",
        "function": {
            "name": "find_helplines",
            "description": (
                "Return verified crisis helplines for a country. "
                "Always use the exact phone number and URL from the result — never generate contact details."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "country": {
                        "type": "string",
                        "description": "ISO 3166-1 alpha-2 country code, e.g. 'US', 'AU', 'JP'",
                    },
                    "category": {
                        "type": "string",
                        "description": (
                            "Optional category filter: suicide_prevention, mental_health, "
                            "domestic_violence, sexual_violence, substance_abuse, youth, "
                            "lgbtq, veterans, elder, grief, general_crisis, other"
                        ),
                    },
                },
                "required": ["country"],
            },
        },
    }
]


# ---------------------------------------------------------------------------
# Agentic loop
# ---------------------------------------------------------------------------

SYSTEM = (
    "You help users find verified crisis and mental health helplines. "
    "Always present phone numbers and URLs exactly as provided by the tool. "
    "If someone is in immediate danger, tell them to call emergency services first."
)


def main() -> None:
    messages = [
        {"role": "system", "content": SYSTEM},
        {
            "role": "user",
            "content": "What mental health helplines are available in Germany?",
        },
    ]

    while True:
        response = client.chat.completions.create(
            model="llama3.2",  # swap for any Ollama model that supports tool calls
            messages=messages,
            tools=tools,
            tool_choice="auto",
        )

        choice = response.choices[0]
        messages.append(choice.message.model_dump())

        if choice.finish_reason != "tool_calls":
            print(choice.message.content)
            break

        for call in choice.message.tool_calls or []:
            args = json.loads(call.function.arguments)
            records = find_helplines(
                country=args["country"],
                category=args.get("category"),
            )
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": call.id,
                    "content": json.dumps(records, ensure_ascii=False),
                }
            )


if __name__ == "__main__":
    main()
