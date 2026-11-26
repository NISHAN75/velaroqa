import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/common/ProductCard/ProductCard";
import ProductCardSkeleton from "../components/common/ProductCard/ProductCardSkeleton";
import { useProducts } from "../context/ProductsContext";
import { buildOrderLink } from "../utils/whatsapp";

const PER_PAGE_OPTIONS = [8, 12, 24];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A–Z" },
];

const formatPrice = (n) => `QR ${Number(n).toLocaleString("en-US")}`;
const hasDiscount = (p) => typeof p.discountPrice === "number" && p.discountPrice < p.price;
const finalPrice = (p) => (hasDiscount(p) ? p.discountPrice : p.price);
const brandOf = (p) => p.brand || p.name.split(" ")[0];

// 1 2 3 ... 6  (always first, last and the pages around the current one)
function getPageList(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("...");
    out.push(p);
  });
  return out;
}

/* ---------- List view row ---------- */
function ProductListItem({ product }) {
  const { id, name, description, price, discountPrice, image, isNew } = product;
  const discounted = hasDiscount(product);
  const percent = discounted ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const productUrl = `/product/${id}`;

  return (
    <article className="flex gap-3 overflow-hidden rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200/60 sm:gap-4">
      <Link
        to={productUrl}
        className="relative block h-28 w-32 shrink-0 overflow-hidden rounded-lg bg-[#F3F6FB] sm:h-32 sm:w-44"
      >
        <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover" />
        {isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-[#2563EB] px-2 py-0.5 text-[9px] font-bold text-white">
            New
          </span>
        )}
        {discounted && (
          <span className="absolute right-2 top-2 rounded-full bg-[#0F172A] px-2 py-0.5 text-[9px] font-bold text-[#38BDF8]">
            -{percent}%
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="line-clamp-1 text-sm font-bold text-[#0F172A]">
          <Link to={productUrl} className="hover:text-[#1D4ED8]">
            {name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{description}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-[#0F172A]">
              {formatPrice(finalPrice(product))}
            </span>
            {discounted && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(price)}</span>
            )}
          </div>
          <a
            href={buildOrderLink(
              { ...product, category: product.category || "Sneakers" },
              { url: `${window.location.origin}${productUrl}` }
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-lg bg-[#F3F6FB] px-4 py-2 text-[11px] font-bold text-[#1D4ED8] transition duration-200 hover:bg-[#2563EB] hover:text-white"
          >
            Order Now
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

/* ---------- Page ---------- */
export default function Shop() {
  const { products, featured, loading, error, reload } = useProducts();

  // Search text lives in the URL: /shop?q=nike
  // (the Header search box and this page's search box are the same thing)
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const setQuery = (value) => setSearchParams(value ? { q: value } : {}, { replace: true });

  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [perPage, setPerPage] = useState(8);
  const [page, setPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySale, setOnlySale] = useState(false);

  const activeFilterCount =
    (minPrice !== "" ? 1 : 0) + (maxPrice !== "" ? 1 : 0) + (onlyNew ? 1 : 0) + (onlySale ? 1 : 0);

  // search / filter / sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    const featuredIds = new Set(featured.map((p) => p.id));

    const list = products.filter((p) => {
      if (q && !`${p.name} ${brandOf(p)}`.toLowerCase().includes(q)) return false;
      const price = finalPrice(p);
      if (min != null && price < min) return false;
      if (max != null && price > max) return false;
      if (onlyNew && !p.isNew) return false;
      if (onlySale && !hasDiscount(p)) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => finalPrice(a) - finalPrice(b));
      case "price-desc":
        return list.sort((a, b) => finalPrice(b) - finalPrice(a));
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default: // featured first, then the rest in API order (newest first)
        return list.sort((a, b) => Number(featuredIds.has(b.id)) - Number(featuredIds.has(a.id)));
    }
  }, [products, featured, query, sort, minPrice, maxPrice, onlyNew, onlySale]);

  // go back to page 1 whenever the list changes
  useEffect(() => {
    setPage(1);
  }, [query, sort, perPage, minPrice, maxPrice, onlyNew, onlySale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const visible = filtered.slice(start, start + perPage);

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setOnlyNew(false);
    setOnlySale(false);
  };

  const inputClass =
    "h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20";

  return (
    <section className="font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#F3F6FB] p-4 sm:p-6">
          {/* Top bar: search, filters, sort, view */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by model or brand..."
                className={`${inputClass} w-full bg-white pl-9`}
              />
            </label>

            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#1D4ED8] hover:text-[#2563EB]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-[#2563EB] px-1.5 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="ml-auto flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                Sort:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={`${inputClass} font-semibold`}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center gap-1">
                {[
                  { id: "list", Icon: List, label: "List view" },
                  { id: "grid", Icon: LayoutGrid, label: "Grid view" },
                ].map(({ id, Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    aria-label={label}
                    aria-pressed={view === id}
                    className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
                      view === id
                        ? "bg-white text-[#1D4ED8] shadow-sm"
                        : "text-slate-400 hover:text-[#2563EB]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap items-end gap-4 rounded-xl bg-white p-4 ring-1 ring-slate-200/60">
              <div>
                <p className="mb-1 text-[11px] font-bold text-[#0F172A]">Price (QR )</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className={`${inputClass} w-24`}
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className={`${inputClass} w-24`}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={onlyNew}
                  onChange={(e) => setOnlyNew(e.target.checked)}
                  className="h-4 w-4 accent-[#2563EB]"
                />
                New arrivals
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={(e) => setOnlySale(e.target.checked)}
                  className="h-4 w-4 accent-[#2563EB]"
                />
                On sale
              </label>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#2563EB]"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Products */}
          <div className="mt-5">
            {error && (
              <div className="py-10 text-center">
                <p className="text-sm text-red-500">Could not load products.</p>
                <button
                  type="button"
                  onClick={reload}
                  className="mt-3 rounded-lg bg-[#2563EB] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  Try again
                </button>
              </div>
            )}

            {!error && loading && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                <ProductCardSkeleton count={8} />
              </div>
            )}

            {!error && !loading && filtered.length === 0 && (
              <p className="py-14 text-center text-sm text-slate-500">
                No products found. Try a different search or clear the filters.
              </p>
            )}

            {!loading && visible.length > 0 &&
              (view === "grid" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {visible.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {visible.map((p) => (
                    <ProductListItem key={p.id} product={p} />
                  ))}
                </div>
              ))}
          </div>

          {/* Bottom bar: per page + pagination */}
          {!loading && filtered.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-4">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                Show per page:
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className={`${inputClass} h-8 font-semibold`}
                >
                  {PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <p className="text-[11px] text-slate-400">
                Showing {start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length}
              </p>

              {totalPages > 1 && (
                <nav aria-label="Pagination" className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {getPageList(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className="px-1 text-xs text-slate-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => goToPage(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`flex h-7 min-w-[28px] items-center justify-center rounded-md px-2 text-xs font-bold transition ${
                          p === currentPage
                            ? "bg-[#2563EB] text-white shadow-sm"
                            : "text-slate-600 hover:bg-white hover:text-[#2563EB]"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}