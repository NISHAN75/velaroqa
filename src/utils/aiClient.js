// Velaroqa AI – Phase 4: browser side of the AI chat.
// Talks only to OUR server (/api/chat). The Gemini key is never in the browser.
import { CHATBOT, AI } from "../data/chatbotConfig";

// kind: "rate_limited" | "timeout" | "network" | "server" | "aborted"
export class AiError extends Error {
  constructor(kind, status = 0) {
    super(kind);
    this.kind = kind;
    this.status = status;
  }
}

/**
 * messages: the chat messages ({ role, text, productIds })
 * signal:   AbortSignal, used to cancel when the chat is cleared or closed
 * returns:  { text, productIds }  (throws AiError on any failure)
 */
export async function askAI(messages, signal) {
  const payload = {
    messages: messages.slice(-AI.historyLimit).map((m) => ({
      role: m.role,
      text: String(m.text).slice(0, CHATBOT.maxLength),
      productIds: m.productIds || [],
    })),
  };

  // One controller handles both "caller cancelled" and "took too long"
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, AI.timeoutMs);
  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onAbort, { once: true });
  }

  try {
    const response = await fetch(AI.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (response.status === 429) throw new AiError("rate_limited", 429);
    if (!response.ok) throw new AiError("server", response.status);

    const data = await response.json();
    if (typeof data?.reply !== "string" || !data.reply.trim()) throw new AiError("server", 200);

    return {
      text: data.reply,
      productIds: Array.isArray(data.productIds) ? data.productIds.filter(Number.isFinite) : [],
    };
  } catch (error) {
    if (error instanceof AiError) throw error;
    if (error?.name === "AbortError") throw new AiError(timedOut ? "timeout" : "aborted");
    throw new AiError("network");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}