import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  formatPrice,
  getProductUrl,
  hasDiscount,
  getDiscountPercent,
} from "../../utils/productSearch";

/**
 * Small product card inside the chat. The whole card is one link to the
 * product details page (/product/:id).
 */
export default function ChatProductCard({ product, onNavigate }) {
  const discounted = hasDiscount(product);

  return (
    <Link
      to={getProductUrl(product)}
      onClick={onNavigate}
      className="group flex items-center gap-3 rounded-xl bg-white p-2 ring-1 ring-slate-200 transition duration-200 hover:ring-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.99]"
    >
      <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain"
        />
        {product.isNew && (
          <span className="absolute left-0.5 top-0.5 rounded bg-primary-dark px-1 py-px text-[8px] font-bold uppercase text-white">
            New
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold text-ink">
          {product.name}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5">
          <span className="text-[13px] font-bold text-primary-dark">
            {formatPrice(discounted ? product.discountPrice : product.price)}
          </span>
          {discounted && (
            <>
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="rounded bg-emerald-50 px-1 py-px text-[10px] font-bold text-emerald-600">
                -{getDiscountPercent(product)}%
              </span>
            </>
          )}
        </span>
        <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-primary-dark">
          View details
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}