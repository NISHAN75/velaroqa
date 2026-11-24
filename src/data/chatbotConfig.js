// Velaroqa – chatbot content (all local, no AI API yet).
// Edit the texts here, not in the components.

export const CHATBOT = {
  name: "Velaroqa Ai",
  subtitle: "Your Personal Shopping Assistant",
  placeholder: "Ask me anything...",
  maxLength: 500,
  greetingDelayMs: 700, // typing dots shown before the welcome message
  replyDelayMs: 900, // typing dots shown before a quick-button reply
  welcome:
    "Hello! 👋 Welcome to Velaroqa.\nI'm your personal shopping assistant. I can help you discover sneakers, explore new arrivals, find the best deals and place orders.\nHow can I help you today?",
};

// Phase 3: each button has an `intent`. The reply engine (utils/botReply.js)
// answers it with real product data from products.js.
export const QUICK_SUGGESTIONS = [
  { id: "products", intent: "products", emoji: "🛍️", label: "Show me products" },
  { id: "featured", intent: "featured", emoji: "🔥", label: "Featured Products" },
  { id: "new", intent: "new", emoji: "🆕", label: "New Arrivals" },
  { id: "price", intent: "price", emoji: "💰", label: "Find products by price" },
  { id: "order", intent: "order", emoji: "📦", label: "Help me place an order" },
];

// Used only when the AI cannot be reached AND the local product search has no answer.
export const FALLBACK_REPLY =
  "Sorry, I couldn't answer that just now. Please try again in a moment. 🙏";

// Phase 4: AI connection settings (the secret key lives on the server, never here).
export const AI = {
  endpoint: "/api/chat",
  timeoutMs: 20000, // stop waiting after 20 seconds
  historyLimit: 12, // how many recent messages the AI sees (keeps context, saves cost)
  rateLimitedReply:
    "You're sending messages a little fast. Please wait a few seconds and try again. ⏳",
  disclaimer: "AI can make mistakes. Please check details on the product page.",
};

// Phase 2: conversation history (saved in the browser's localStorage).
// Bump `version` if the saved message format ever changes; old data is then ignored safely.
export const STORAGE = {
  key: "Velaroqa.chat.history",
  version: 1,
  maxMessages: 100, // only the newest messages are kept on disk
};

// Phase 2: "clear conversation" confirmation dialog texts.
export const CLEAR_CHAT = {
  title: "Start a new conversation?",
  description:
    "This will delete your current chat history from this device. This can't be undone.",
  cancel: "Cancel",
  confirm: "Clear chat",
};