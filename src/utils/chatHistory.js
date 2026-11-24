import { STORAGE } from "../data/chatbotConfig";

/* ---------- Message creation ---------- */

// Unique id. crypto.randomUUID only exists on secure origins (https / localhost),
// so there is a fallback for e.g. testing on a phone over the local network.
export function createId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through to the fallback */
  }
  return `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// role: "user" | "assistant"
// productIds (optional): ids of products shown as cards under an assistant message.
// Only ids are stored, so prices/images are always read fresh from products.js.
export function createMessage(role, text, productIds = []) {
  return { id: createId(), role, text, productIds, time: new Date() };
}

/* ---------- localStorage helpers (never throw) ---------- */

const VALID_ROLES = ["user", "assistant"];

// Accessing localStorage itself can throw (blocked cookies, some private modes).
function getStore() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

// Returns a clean message, or null if the saved item is unusable.
function sanitize(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!VALID_ROLES.includes(raw.role)) return null;
  if (typeof raw.text !== "string" || !raw.text.trim()) return null;

  const time = new Date(raw.time);
  const productIds = Array.isArray(raw.productIds)
    ? raw.productIds.filter((id) => Number.isFinite(id)).slice(0, 10)
    : [];
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : createId(),
    role: raw.role,
    text: raw.text,
    productIds,
    time: Number.isNaN(time.getTime()) ? new Date() : time,
  };
}

/* ---------- Public API ---------- */

// Loads the saved conversation. Anything invalid or corrupted is dropped,
// and a completely broken entry is removed so it can't cause trouble again.
export function loadMessages() {
  const store = getStore();
  if (!store) return [];

  let raw;
  try {
    raw = store.getItem(STORAGE.key);
  } catch {
    return [];
  }
  if (raw == null) return [];

  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== STORAGE.version || !Array.isArray(data.messages)) {
      throw new Error("Unexpected chat history format");
    }

    const seen = new Set();
    const messages = [];
    for (const item of data.messages) {
      const message = sanitize(item);
      if (!message) continue;
      if (seen.has(message.id)) message.id = createId(); // keep ids unique
      seen.add(message.id);
      messages.push(message);
    }
    return messages.slice(-STORAGE.maxMessages);
  } catch {
    try {
      store.removeItem(STORAGE.key);
    } catch {
      /* ignore */
    }
    return [];
  }
}

// Saves the conversation. An empty list removes the saved entry.
export function saveMessages(messages) {
  const store = getStore();
  if (!store) return;

  try {
    if (!messages.length) {
      store.removeItem(STORAGE.key);
      return;
    }
    const payload = {
      version: STORAGE.version,
      messages: messages.slice(-STORAGE.maxMessages).map((m) => ({
        id: m.id,
        role: m.role,
        text: m.text,
        productIds: m.productIds?.length ? m.productIds : undefined,
        time: m.time.toISOString(),
      })),
    };
    store.setItem(STORAGE.key, JSON.stringify(payload));
  } catch {
    /* storage full or blocked: the chat keeps working in memory */
  }
}

export function clearMessages() {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(STORAGE.key);
  } catch {
    /* ignore */
  }
}