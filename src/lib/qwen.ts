/**
 * Local Qwen Code / OpenAI-compatible client.
 * Default: disabled. Endpoint and model live in localStorage (never env secrets).
 * When enabled, POSTs to `{baseUrl}/chat/completions` — typical local servers:
 *   Ollama        http://127.0.0.1:11434/v1
 *   LM Studio     http://127.0.0.1:1234/v1
 *   llama.cpp     http://127.0.0.1:8081/v1   (avoid 8080 — ARGOS binds that)
 *   vLLM / Qwen   http://127.0.0.1:8000/v1
 */

export const QWEN_STORAGE_KEY = "argos-qwen";

export interface QwenConfig {
  enabled: boolean;
  baseUrl: string;
  model: string;
  apiKey: string;
}

export const DEFAULT_QWEN: QwenConfig = {
  enabled: false,
  baseUrl: "http://127.0.0.1:11434/v1",
  model: "qwen2.5-coder:7b",
  apiKey: "",
};

export function loadQwenConfig(): QwenConfig {
  try {
    const raw = localStorage.getItem(QWEN_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_QWEN };
    const p = JSON.parse(raw) as Partial<QwenConfig>;
    return { ...DEFAULT_QWEN, ...p };
  } catch {
    return { ...DEFAULT_QWEN };
  }
}

export function saveQwenConfig(cfg: QwenConfig) {
  try {
    localStorage.setItem(QWEN_STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    /* private mode */
  }
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function qwenChat(
  messages: ChatMessage[],
  cfg: QwenConfig,
  opts?: { timeoutMs?: number },
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!cfg.enabled) {
    return { ok: false, error: "Local Qwen is off. Enable it in Docs → Local AI." };
  }
  const url = `${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), opts?.timeoutMs ?? 20_000);
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature: 0.2,
        max_tokens: 800,
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Qwen HTTP ${res.status} ${body.slice(0, 180)}` };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) return { ok: false, error: "Empty completion from local model." };
    return { ok: true, text };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "network";
    return {
      ok: false,
      error: `Cannot reach ${url} (${msg}). Start Qwen Code / Ollama locally, then retry.`,
    };
  } finally {
    clearTimeout(t);
  }
}

export const QWEN_SYSTEM = `You are the ARGOS desk assistant running locally. Be terse, numerical, and cite which ARGOS view (Monitor, COT, STIR, Risk, Macro) the user should open. Never invent live prints — the terminal's tape is synthetic unless a live feed is wired.`;
