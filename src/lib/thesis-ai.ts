import { createServerFn } from "@tanstack/react-start";

export interface ThesisDraft {
  title: string;
  instrument: string;
  domain: "Geopolitics" | "Macro" | "Commodities" | "FX" | "Equities" | "Rates" | "Crypto" | "Energy";
  type: "Market" | "Trade";
  memo: string;
  supports: string[];
  cuts: string[];
  changeMind: string[];
  horizon: string;
}

export const draftThesisFromNote = createServerFn({ method: "POST" })
  .validator((d: { house: string; title: string; body: string; href: string }) => d)
  .handler(async ({ data }): Promise<{ ok: true; draft: ThesisDraft; via: "grok" } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Grok is not available in this environment." };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "You are the ARGOS desk. Turn a street research note into one tradable thesis. Reply with JSON only, no markdown. Keys: title, instrument (ticker or FX pair), domain (Geopolitics|Macro|Commodities|FX|Equities|Rates|Crypto|Energy), type (Market|Trade), memo (120-180 words, desk voice), supports (3 strings), cuts (3 strings), changeMind (2 strings), horizon (e.g. 6w). Do not invent prints. If the note is colour not a trade, still produce a small, explicit expression.",
          },
          {
            role: "user",
            content: `House: ${data.house}\nTitle: ${data.title}\nURL: ${data.href}\nBody:\n${data.body.slice(0, 1800)}`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `xAI ${res.status}` };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content ?? "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd < 0) return { ok: false, error: "Grok did not return JSON." };
    try {
      const draft = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as ThesisDraft;
      if (!draft.title || !draft.instrument) return { ok: false, error: "Incomplete draft." };
      return { ok: true, draft, via: "grok" };
    } catch {
      return { ok: false, error: "Could not parse Grok JSON." };
    }
  });
