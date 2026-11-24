import { Star } from "lucide-react";
import { featuredProducts } from "../../../data/products";
import ProductCard from "../../common/ProductCard/ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts({ products = featuredProducts }) {
  // Nothing flagged as featured -> render nothing instead of an empty heading.
  if (!products.length) return null;

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

        {/* Grid: 2 columns on mobile and tablet, 4 on desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}