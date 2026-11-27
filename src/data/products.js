// Products now come from the backend API (not hard-coded any more).
//   GET {API_URL}/api/products
//
// Backend field        ->  what the site uses
//   price ("2100.00")  ->  price (number)
//   discount ("8.00")  ->  discountPrice (price minus that % — only if discount > 0)
//   images [...]       ->  images (full URLs) + image (first one)
//   image_url          ->  used only if the backend has no images array
//   created_at         ->  isNew (true if created in the last NEW_DAYS days)
//   sizes ["39","42"]  ->  sizes [39, 42]

export const API_URL = (
  import.meta.env.BACKEND_API_URL || "https://server.velaroqa.com"
).replace(/\/$/, "");

// Image gulo alada host e thakle .env e VITE_IMAGE_URL dao (na dile API_URL-i use hobe)
export const IMAGE_URL = (import.meta.env.VITE_IMAGE_URL || API_URL).replace(/\/$/, "");

export const NEW_DAYS = 7; // a product shows the "New" tag for this many days
export const FEATURED_COUNT = 5; // how many random featured cards to show

const DAY_MS = 24 * 60 * 60 * 1000;

// "/uploads/a.jpg" -> "https://server.velaroqa.com/uploads/a.jpg"
const toUrl = (path) =>
  !path ? "" : /^https?:\/\//i.test(path) ? path : `${IMAGE_URL}${path}`;

/* ---------- Convert one API product into the shape the cards expect ---------- */
export function normalizeProduct(raw) {
  const price = Number(raw.price) || 0;
  const discountPercent = Number(raw.discount) || 0;
  const discountPrice =
    discountPercent > 0
      ? Math.round(price * (100 - discountPercent)) / 100
      : undefined;
  const createdAt = raw.created_at ? new Date(raw.created_at).getTime() : NaN;
  const isNew =
    Number.isFinite(createdAt) && Date.now() - createdAt <= NEW_DAYS * DAY_MS;

  // images array thakle seta, na hole purono image_url
  const images = (
    Array.isArray(raw.images) && raw.images.length
      ? raw.images
      : raw.image_url
      ? [raw.image_url]
      : []
  )
    .filter(Boolean)
    .map(toUrl);

  const image = images[0] || "";

  const sizes = (Array.isArray(raw.sizes) ? raw.sizes : []).map((s) => {
    const n = Number(s);
    return Number.isNaN(n) ? String(s) : n; // "42" -> 42, "M" stays "M"
  });

  return {
    id: raw.id,
    name: raw.name,
    // backend text sometimes has a stray quote at the start/end
    description: String(raw.description || "").replace(/^"+|"+$/g, "").trim(),
    price,
    discountPrice,
    isNew,
    image, // first image (cards use this)
    images, // all images (product details gallery uses this)
    sizes,
    createdAt: raw.created_at,
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retries when the backend is waking up (Vercel cold start) or fails once.
export async function fetchProducts(signal, { retries = 3, timeoutMs = 15000 } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const requestCtrl = new AbortController();
    const timer = setTimeout(() => requestCtrl.abort(), timeoutMs);
    const onAbort = () => requestCtrl.abort();
    signal?.addEventListener("abort", onAbort);

    try {
      const res = await fetch(`${API_URL}/api/products`, { signal: requestCtrl.signal });
      if (!res.ok) throw new Error(`Products request failed (${res.status})`);
      const data = await res.json();

return (Array.isArray(data) ? data : []).map(normalizeProduct);
      return (Array.isArray(data) ? data : []).map(normalizeProduct);
    } catch (err) {
      if (signal?.aborted) throw err; // user left the page -> stop retrying
      lastError = err;
      if (attempt < retries) await sleep(800 * (attempt + 1)); // 0.8s, 1.6s, 2.4s
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    }
  }

  if (lastError?.name === "AbortError") throw new Error("Request timed out");
  throw lastError;
}

// Random pick (Fisher–Yates shuffle) — original array is not changed
export function pickRandom(list, count) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/* ---------- Small shared store ----------
   The chatbot helpers (productSearch.js) are plain functions, not React
   components, so they read the loaded products from here.
   ProductsContext fills it as soon as the API answers. */
let store = { products: [], featured: [] };

export const setProductStore = (next) => {
  store = next;
};
export const getProducts = () => store.products;
export const getFeatured = () => store.featured;
export const getProductById = (id) => store.products.find((p) => p.id === Number(id));