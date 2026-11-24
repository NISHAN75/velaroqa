// StepNova AI – Phase 1 content (all local, no API).
// Edit the texts here, not in the components.

export const CHATBOT = {
  name: "StepNova AI",
  subtitle: "Your Personal Shopping Assistant",
  placeholder: "Ask me anything...",
  maxLength: 500,
  greetingDelayMs: 700, // typing dots shown before the welcome message
  replyDelayMs: 900, // typing dots shown before a placeholder reply
  welcome:
    "Hello! 👋 Welcome to StepNova.\nI'm your personal shopping assistant. I can help you discover sneakers, explore new arrivals, find the best deals and place orders.\nHow can I help you today?",
};

// Phase 1: every button shows a local placeholder reply.
export const QUICK_SUGGESTIONS = [
  {
    id: "products",
    emoji: "🛍️",
    label: "Show me products",
    reply:
      "Product browsing inside the chat is coming soon! 🛍️\nSoon I'll show you our sneaker collection right here, with photos and prices.",
  },
  {
    id: "featured",
    emoji: "🔥",
    label: "Featured Products",
    reply:
      "Our hand-picked featured sneakers will appear here soon. 🔥\nFor now, you can scroll down to the Featured Products section on the home page.",
  },
  {
    id: "new",
    emoji: "🆕",
    label: "New Arrivals",
    reply:
      "I'll be able to show you the freshest drops here very soon. 🆕\nStay tuned!",
  },
  {
    id: "price",
    emoji: "💰",
    label: "Find products by price",
    reply:
      "Soon you'll be able to tell me your budget, like “sneakers under ৳5,000”, and I'll find matching pairs. 💰",
  },
  {
    id: "order",
    emoji: "📦",
    label: "Help me place an order",
    reply:
      "Ordering through chat is on its way. 📦\nFor now, open any product and use its order button to send your order on WhatsApp.",
  },
];

export const FALLBACK_REPLY =
  "Thanks for your message! I'm still in preview mode, so I can't answer questions yet. Smart replies are coming soon. ✨";

// Phase 2: conversation history (saved in the browser's localStorage).
// Bump `version` if the saved message format ever changes; old data is then ignored safely.
export const STORAGE = {
  key: "stepnova.chat.history",
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
