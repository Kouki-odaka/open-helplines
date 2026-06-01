/**
 * open-helplines × OpenAI function calling
 *
 * Demonstrates how to let an LLM look up verified crisis lines using
 * open-helplines data via OpenAI's function-calling API.
 *
 * Run:
 *   npm install openai
 *   OPENAI_API_KEY=sk-... npx ts-node main.ts
 */

import OpenAI from "openai";

const REGISTRY_BASE =
  "https://raw.githubusercontent.com/Kouki-odaka/open-helplines/main/data";

// ---------------------------------------------------------------------------
// Types (mirror of @open-helplines/core HelplineRecord)
// ---------------------------------------------------------------------------

interface HelplineContact {
  method: "phone" | "text" | "chat" | "email" | "app";
  number?: string;
  url?: string;
  languages: string[];
  hours: string;
  free: boolean;
  anonymous?: boolean;
}

interface HelplineRecord {
  id: string;
  country: string;
  name: string;
  local_name?: string;
  category: string;
  secondary_categories?: string[];
  contacts: HelplineContact[];
  description: string;
  website?: string;
  verified_at: string;
  source: string;
  government_backed: boolean;
  tags?: string[];
}

// ---------------------------------------------------------------------------
// Registry access — fetch from CDN, no API key needed
// ---------------------------------------------------------------------------

async function findHelplines(args: {
  country: string;
  category?: string;
}): Promise<HelplineRecord[]> {
  const cc = args.country.toLowerCase();
  const url = `${REGISTRY_BASE}/countries/${cc}/index.json`;

  const res = await fetch(url);
  if (!res.ok) {
    // Country not yet in registry
    return [];
  }

  const records: HelplineRecord[] = await res.json();

  if (args.category) {
    return records.filter(
      (r) =>
        r.category === args.category ||
        r.secondary_categories?.includes(args.category!)
    );
  }

  return records;
}

// ---------------------------------------------------------------------------
// Tool definition for OpenAI
// ---------------------------------------------------------------------------

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "find_helplines",
      description:
        "Return verified crisis hotlines and mental health contact services for a given country. " +
        "Always surface the phone number and URL verbatim — never paraphrase or generate contact details.",
      parameters: {
        type: "object",
        properties: {
          country: {
            type: "string",
            description: "ISO 3166-1 alpha-2 country code (e.g. 'JP', 'US', 'AU')",
          },
          category: {
            type: "string",
            description:
              "Filter by service category. One of: suicide_prevention, mental_health, " +
              "domestic_violence, sexual_violence, substance_abuse, youth, lgbtq, " +
              "veterans, elder, grief, general_crisis, other",
          },
        },
        required: ["country"],
        additionalProperties: false,
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Format a helpline for display
// ---------------------------------------------------------------------------

function formatRecord(r: HelplineRecord): string {
  const contacts = r.contacts
    .map((c) => {
      const reach =
        c.method === "phone" || c.method === "text"
          ? c.number ?? ""
          : c.url ?? "";
      return `  ${c.method.toUpperCase()}: ${reach} (${c.hours}, ${c.free ? "free" : "paid"})`;
    })
    .join("\n");

  return [
    `**${r.name}**${r.local_name ? ` (${r.local_name})` : ""}`,
    r.description,
    contacts,
    `Verified: ${r.verified_at}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Main conversation loop
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const client = new OpenAI();

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant that finds verified mental health crisis resources. " +
        "When you retrieve helpline records, present the phone number and URL EXACTLY as returned — " +
        "do not paraphrase, modify, or generate contact information. " +
        "Always remind users that if they are in immediate danger, they should call emergency services.",
    },
    {
      role: "user",
      content:
        "I'm looking for suicide prevention helplines in Japan. I need to add them to my app.",
    },
  ];

  let response = await client.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
    tool_choice: "auto",
  });

  // Handle tool calls
  while (response.choices[0].finish_reason === "tool_calls") {
    const assistantMessage = response.choices[0].message;
    messages.push(assistantMessage);

    for (const call of assistantMessage.tool_calls ?? []) {
      const args = JSON.parse(call.function.arguments) as {
        country: string;
        category?: string;
      };

      const records = await findHelplines(args);

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(
          records.map((r) => ({
            id: r.id,
            name: r.name,
            local_name: r.local_name,
            category: r.category,
            contacts: r.contacts,
            description: r.description,
            verified_at: r.verified_at,
          }))
        ),
      });
    }

    response = await client.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools,
      tool_choice: "auto",
    });
  }

  const reply = response.choices[0].message.content;
  console.log(reply);
}

main().catch(console.error);
