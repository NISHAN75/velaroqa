import ProductCard from "../../common/ProductCard/ProductCard";
import { products as allProducts } from "../../../data/products";

const getBrand = (p) => p.brand || p.name.split(" ")[0];
const getCategory = (p) => p.category || "Sneakers";

/**
 * Shows other products on the product details page.
 * Same brand ranks first, then same category, then the rest.
 * The current product is never shown.
 */
export default function RelatedProducts({ product, limit = 4 }) {
  const related = allProducts
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      score:
        (getBrand(p) === getBrand(product) ? 2 : 0) +
        (getCategory(p) === getCategory(product) ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);

  // Nothing to show -> render nothing instead of an empty heading
  if (!related.length) return null;

  return (
    <div
      aria-labelledby="related-products-title"
      className="font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-5">
          <h2
            id="related-products-title"
            className="text-xl font-extrabold text-[#0F172A] sm:text-2xl"
          >
            Related Products
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
            You may also like these
          </p>
        </div>

        {/* Grid: 2 columns on mobile and tablet, 4 on desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}