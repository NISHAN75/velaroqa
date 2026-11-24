// Velaroqa AI – Phase 3: helpers that read the REAL product data (src/data/products.js).
// Nothing here invents product information: every answer comes from products.js.
import { products } from "../data/products";

/* ---------- Basic product helpers ---------- */

export const formatPrice = (n) => `৳${Number(n).toLocaleString("en-US")}`;

export const hasDiscount = (p) =>
  typeof p.discountPrice === "number" && p.discountPrice < p.price;

// The price the customer really pays
export const getFinalPrice = (p) => (hasDiscount(p) ? p.discountPrice : p.price);

export const getDiscountPercent = (p) =>
  hasDiscount(p) ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;

// Same URL the product cards use (route: /product/:id)
export const getProductUrl = (p) => `/product/${p.id}`;

export const getAllProducts = () => products;
export const getFeaturedProducts = () => products.filter((p) => p.isFeatured);
export const getNewArrivals = () => products.filter((p) => p.isNew);
export const getDiscountedProducts = () =>
  products
    .filter(hasDiscount)
    .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));

export const getPriceRange = () => {
  const prices = products.map(getFinalPrice);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

/* ---------- Price / budget ---------- */

const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";

const toEnglishDigits = (text) =>
  text.replace(/[০-৯]/g, (d) => String(BENGALI_DIGITS.indexOf(d)));

// Finds prices in a sentence: "5000", "5,000", "5k", "৫০০০", "5000 taka" ...
// Numbers below 500 are ignored on purpose (they are sizes / quantities, e.g. "size 42").
function extractAmounts(text) {
  const clean = toEnglishDigits(text.toLowerCase()).replace(/(\d),(?=\d{3})/g, "$1");
  const amounts = [];
  const pattern = /(\d+(?:\.\d+)?)\s*(k\b|হাজার|hajar)?/g;
  let match;
  while ((match = pattern.exec(clean)) !== null) {
    let value = parseFloat(match[1]);
    if (match[2]) value *= 1000;
    if (value >= 500) amounts.push(Math.round(value));
  }
  return amounts;
}

const ABOVE_WORDS = /(above|over|more than|at least|minimum|min\b|উপরে|upore|বেশি|beshi)/i;
const RANGE_WORDS = /(between|from|range|to\b|-|–|থেকে|theke)/i;

/**
 * Reads a budget from the customer's message.
 * Returns { min, max } (either may be null) or null if no price was found.
 *   "under 5000" -> { min: null, max: 5000 }
 *   "above 4k"   -> { min: 4000, max: null }
 *   "3000 to 5000" -> { min: 3000, max: 5000 }
 *   "5000 er niche" / "৫০০০ টাকার মধ্যে" -> { min: null, max: 5000 }
 */
export function parseBudget(text) {
  const amounts = extractAmounts(text);
  if (amounts.length === 0) return null;

  if (amounts.length >= 2 && RANGE_WORDS.test(text)) {
    const [a, b] = amounts;
    return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  if (ABOVE_WORDS.test(text)) return { min: amounts[0], max: null };
  return { min: null, max: amounts[0] }; // a single number is treated as the budget limit
}

export function filterByBudget({ min, max }) {
  return products
    .filter((p) => {
      const price = getFinalPrice(p);
      return (min == null || price >= min) && (max == null || price <= max);
    })
    .sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
}

export const getCheapest = (count = 3) =>
  [...products].sort((a, b) => getFinalPrice(a) - getFinalPrice(b)).slice(0, count);

/* ---------- Product search (by name / description) ---------- */

// Words that carry no product meaning
const STOP_WORDS = new Set([
  "show", "me", "the", "and", "for", "you", "your", "have", "any", "got", "are",
  "with", "can", "please", "want", "need", "looking", "find", "see", "get", "buy",
  "some", "this", "that", "what", "which", "all", "our", "about", "tell", "give",
  "shoe", "shoes", "sneaker", "sneakers", "product", "products", "price", "prices",
  "under", "below", "above", "over", "than", "less", "more", "taka", "tk", "best",
  "new", "latest", "featured", "deal", "deals", "offer", "offers", "discount",
  "order", "details", "detail", "link", "available", "stock", "pair", "pairs",
  "ache", "ase", "dekhao", "dao", "chai", "jute", "juta",
]);

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word) && !/^\d+$/.test(word));

// The meaningful words of a message (used to know if the customer asked for something specific)
export const getSearchWords = (text) => tokenize(text);

/**
 * Finds products whose NAME matches a word in the message (e.g. "nike", "puma", "dunk").
 * Only the product name is used, so words in long descriptions can't give odd results.
 * Best match first.
 */
export function searchProducts(text) {
  const words = tokenize(text);
  if (words.length === 0) return [];

  return products
    .map((product) => {
      const name = product.name.toLowerCase();
      const score = words.filter((word) => name.includes(word)).length;
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
}