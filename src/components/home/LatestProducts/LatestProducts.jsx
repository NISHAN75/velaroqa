import { ArrowRight } from "lucide-react";
import ProductCard from "../../common/ProductCard/ProductCard";
import ProductCardSkeleton from "../../common/ProductCard/ProductCardSkeleton";
import { useProducts } from "../../../context/ProductsContext";
import "./LatestProducts.css";

// How many products to show in this section
const LATEST_LIMIT = 8;

export default function LatestProducts() {
  const { products: all, loading, error } = useProducts();
  // API already returns newest first
  const products = all.slice(0, LATEST_LIMIT);

  return (
    <section
      aria-labelledby="new-arrivals-title"
      className="font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#F3F6FB] p-4 sm:p-6">
          {/* Heading row */}
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 id="new-arrivals-title" className="text-xl font-extrabold text-[#0F172A] sm:text-2xl">
                New Arrivals
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                Discover our latest collection
              </p>
            </div>
            <a
              href="/shop"
              className="latest-view-all flex shrink-0 items-center gap-1 text-xs font-bold text-[#1D4ED8] hover:text-[#2563EB]"
            >
              View All Products
              <ArrowRight className="latest-arrow h-3.5 w-3.5" />
            </a>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {loading && <ProductCardSkeleton count={4} />}
            {!loading && products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {error && (
            <p className="mt-3 text-center text-xs text-red-500">
              Could not load products. Please refresh the page.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}