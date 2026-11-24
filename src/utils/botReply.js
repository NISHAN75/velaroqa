// Velaroqa – Phase 3: reply engine.
//
// This is NOT real AI. It is a simple rule-based "brain" that understands a few
// shopping requests and answers with REAL data from products.js.
//
// ChatBot.jsx only calls  getBotReply(text, intent)  and gets back
//   { text: "message", productIds: [1, 2, ...] }
// In a later phase this one function can be replaced by a call to the real AI API,
// and the chat UI will not need to change.
import { FALLBACK_REPLY } from "../data/chatbotConfig";
import {
  formatPrice,
  getAllProducts,
  getFeaturedProducts,
  getNewArrivals,
  getDiscountedProducts,
  getPriceRange,
  getCheapest,
  getDiscountPercent,
  getFinalPrice,
  parseBudget,
  filterByBudget,
  searchProducts,
  getSearchWords,
} from "./productSearch";

const MAX_CARDS = 5; // product cards shown under one reply

const ids = (list) => list.slice(0, MAX_CARDS).map((p) => p.id);
const reply = (text, list = []) => ({ text, productIds: ids(list) });

// "Here are 5 of our 8 sneakers:" / "Here is 1 matching sneaker:"
// noun is singular; "s" is added when needed. suffix goes after it (e.g. " under ৳5,000").
const countLine = (list, noun, suffix = "") => {
  const n = list.length;
  if (n > MAX_CARDS) return `Here are ${MAX_CARDS} of our ${n} ${noun}s${suffix}:`;
  return `Here ${n === 1 ? "is" : "are"} ${n} ${noun}${n === 1 ? "" : "s"}${suffix}:`;
};

const has = (text, pattern) => pattern.test(text);

/* ---------- Intent handlers ---------- */

function showAll() {
  const list = getAllProducts();
  return reply(
    `${countLine(list, "sneaker")}\nTell me your budget (like “under ৳4,500”) or a brand (like “Nike”) and I'll narrow it down.`,
    list
  );
}

function showFeatured() {
  const list = getFeaturedProducts();
  if (list.length === 0) {
    return reply("We don't have featured products at the moment. Ask me to show all sneakers instead!");
  }
  return reply(`🔥 ${countLine(list, "featured sneaker")}`, list);
}

function showNew() {
  const list = getNewArrivals();
  if (list.length === 0) {
    return reply("There are no new arrivals marked right now. Want to see our featured sneakers instead?");
  }
  return reply(`🆕 ${countLine(list, "new arrival")}`, list);
}

function showDiscounts() {
  const list = getDiscountedProducts();
  if (list.length === 0) {
    return reply("There are no discounted sneakers right now. Check back soon!");
  }
  const best = list[0];
  return reply(
    `💸 ${countLine(list, "sneaker", " on discount")}\nBiggest saving: ${best.name} at ${getDiscountPercent(best)}% off.`,
    list
  );
}

function askBudget() {
  const { min, max } = getPriceRange();
  return reply(
    `💰 Our sneakers range from ${formatPrice(min)} to ${formatPrice(max)}.\nTell me your budget, for example “under 4500” or “between 3500 and 5000”, and I'll find matching pairs.`
  );
}

// base: optional list (e.g. only Nike sneakers) that the budget is applied to
function byBudget(budget, base = null) {
  const list = base
    ? filterByBudget(budget).filter((p) => base.some((b) => b.id === p.id))
    : filterByBudget(budget);
  const { min, max } = budget;

  let label;
  if (min != null && max != null) label = `between ${formatPrice(min)} and ${formatPrice(max)}`;
  else if (max != null) label = `under ${formatPrice(max)}`;
  else label = `above ${formatPrice(min)}`;

  if (list.length === 0) {
    const cheapest = getCheapest(3);
    return reply(
      `I couldn't find ${base ? "matching " : ""}sneakers ${label}.\nOur most affordable pairs start at ${formatPrice(getFinalPrice(cheapest[0]))}:`,
      cheapest
    );
  }
  return reply(
    `${countLine(list, base ? "matching sneaker" : "sneaker", ` ${label}`)}\nPrices shown are what you pay (discounts included).`,
    list
  );
}

function byName(list) {
  if (list.length === 1) {
    const p = list[0];
    const priceLine = getDiscountPercent(p)
      ? `${formatPrice(p.discountPrice)} (${getDiscountPercent(p)}% off, regular ${formatPrice(p.price)})`
      : formatPrice(p.price);
    return reply(`Here's what I found: ${p.name} for ${priceLine}.\nTap the card to see sizes and full details.`, list);
  }
  return reply(`${countLine(list, "matching sneaker")}`, list);
}

/* ---------- Main entry ---------- */

// intent: optional hint from a quick-suggestion button ("products" | "featured" | "new" | "price" | "order")
export function getBotReply(text, intent) {
  const message = String(text || "").trim();

  // 1) Quick-suggestion buttons know exactly what they want
  switch (intent) {
    case "products":
      return showAll();
    case "featured":
      return showFeatured();
    case "new":
      return showNew();
    case "price":
      return askBudget();
    case "order":
      return reply(
        "📦 Ordering inside the chat is coming soon.\nFor now: pick a sneaker below, open it, choose your size and tap the order button to send your order on WhatsApp.",
        getFeaturedProducts()
      );
    default:
      break;
  }

  // 2) Free typing (English + a few common Bengali words)
  if (
    has(message, /^(hi|hello|hey|hola|salam|assalamu\w*)(?:[\s!.,]|$)/i) ||
    has(message, /^(হ্যালো|হাই|আসসালামু)/)
  ) {
    return reply("Hi there! 👋 I can show you our sneakers, new arrivals, deals, or find pairs within your budget. What are you looking for?");
  }
  if (has(message, /^(thanks|thank you|thx)(?:[\s!.,]|$)/i) || has(message, /^(ধন্যবাদ|dhonnobad)/i)) {
    return reply("You're welcome! 😊 Let me know if you'd like to see more sneakers.");
  }

  // A brand/name (“Nike”, “Puma”) and a budget can be combined: “Nike under 5000”
  const found = searchProducts(message);
  const budget = parseBudget(message);
  if (budget) return byBudget(budget, found.length > 0 ? found : null);
  if (found.length > 0) return byName(found);

  if (has(message, /\b(discounts?|offers?|sale|deals?|cheap)\b|ডিসকাউন্ট|অফার|ছাড়|সস্তা/i)) return showDiscounts();
  if (has(message, /\b(new|latest|arrivals?|fresh|notun|nutun)\b|নতুন/i)) return showNew();
  if (has(message, /\b(featured|popular|trending|best seller)\b|জনপ্রিয়/i)) return showFeatured();
  if (has(message, /\b(budget|price|prices|cost|how much|dam|koto)\b|দাম|দর/i)) return askBudget();
  // "show me products / all sneakers" -> everything. But "running shoes" has a specific word
  // we know nothing about, so it falls through to the honest fallback below.
  const isGeneralRequest =
    has(message, /\b(all|everything|collection|catalog|products?|sneakers?|shoes?|juta|jute)\b|জুতা/i) &&
    getSearchWords(message).length === 0;
  if (isGeneralRequest) return showAll();

  // 3) Nothing matched: be honest, do not guess
  return reply(
    `${FALLBACK_REPLY}\nFor now I can show you: all sneakers, featured, new arrivals, discounts, or sneakers within your budget.`
  );
}