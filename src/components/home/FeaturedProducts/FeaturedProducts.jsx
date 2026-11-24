import { Star } from "lucide-react";
import { useProducts } from "../../../context/ProductsContext";
import ProductCardSkeleton from "../../common/ProductCard/ProductCardSkeleton";
import ProductCard from "../../common/ProductCard/ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  // `featured` = 5 random products picked in ProductsContext
  const { featured: products, loading } = useProducts();

  // Loaded but nothing to show -> render nothing instead of an empty heading.
  if (!loading && !products.length) return null;

  return (
    <section
      aria-labelledby="featured-products-title"
      className="font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-5">
          <h2
            id="featured-products-title"
            className="mt-2 text-xl font-extrabold text-[#0F172A] sm:text-2xl"
          >
            Featured Products
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
            Our top picks for comfort, style and everyday performance
          </p>
        </div>

        {/* Grid: 2 columns on mobile, 3 on tablet, 5 on desktop (5 cards = 1 row) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {loading && <ProductCardSkeleton count={5} />}
          {!loading && products.map((p) => (
            <ProductCard key={p.id} product={p} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}