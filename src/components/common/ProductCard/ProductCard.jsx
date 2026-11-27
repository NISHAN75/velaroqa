import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import OrderModal from "../OrderModal/OrderModal"; // path tomar folder onujayi thik koro
import "./ProductCard.css";

const CURRENCY = "QR";

// size nai hole ei list dekhabe (ProductDetails er moto)
const DEFAULT_SIZES = [39, 40, 41, 42, 43, 44];

// 199 -> "QR 199.00", 119.25 -> "QR 119.25", 1500 -> "QR 1,500.00"
const formatPrice = (n) =>
  `${CURRENCY} ${Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * One card for every product grid.
 *
 * variant="default"  -> "Order Now" button (opens the order modal)
 * variant="featured" -> "BRAND · CATEGORY" label + "View Details" button
 */
export default function ProductCard({ product, variant = "default" }) {
  const { id, name, price, discountPrice, image, isNew } = product;

  
  const isFeatured = variant === "featured";
  const [orderOpen, setOrderOpen] = useState(false);

  // brand / category are optional in the data: fall back so nothing breaks
  const brand = product.brand || name.split(" ")[0];
  const category = product.category || "Sneakers";

  const hasDiscount = typeof discountPrice === "number" && discountPrice < price;

  // Always a whole number: 40.2 -> 40, 33.33 -> 33
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const productUrl = `/product/${id}`;

  const sizes = (product.sizes?.length ? product.sizes : DEFAULT_SIZES).map((s) =>
    typeof s === "object" ? s : { size: s }
  );

  const ctaClass =
    "group mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface py-2 text-[11px] font-bold text-primary-dark transition duration-200 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";
  const arrow = (
    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
  );

  return (
    <article className="product-card flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60">
      {/* Image (the text link below is the keyboard/screen-reader target) */}
      <Link
        to={productUrl}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/3] overflow-hidden bg-white"
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          className="product-img h-full w-full object-contain"
        />

        {/* Badges */}
        {isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-white">
            New
          </span>
        )}
        {hasDiscount && (
          <span className="absolute right-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[9px] font-bold text-accent">
            -{discountPercent}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        {isFeatured && (
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
            {brand} · {category}
          </p>
        )}

        {/* Name */}
        <h3 className="mt-1 line-clamp-1 text-sm font-bold text-ink">
          <Link to={productUrl} className="hover:text-primary-dark">
            {name}
          </Link>
        </h3>

        {/* Price + button stay at the bottom so all cards line up */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-ink">
              {formatPrice(hasDiscount ? discountPrice : price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(price)}</span>
            )}
          </div>

          {isFeatured ? (
            <Link to={productUrl} className={ctaClass}>
              View Details
              {arrow}
            </Link>
          ) : (
            <button type="button" onClick={() => setOrderOpen(true)} className={ctaClass}>
              Order Now
              {arrow}
            </button>
          )}
        </div>
      </div>

      {/* Portal: card er hover transform/overflow-hidden modal ke atkabe na */}
      {!isFeatured &&
        createPortal(
          <OrderModal
            open={orderOpen}
            onClose={() => setOrderOpen(false)}
            product={product}
            unitPrice={hasDiscount ? discountPrice : price}
            sizes={sizes}
            initialSize={sizes[0]?.size}
            initialQuantity={1}
          />,
          document.body
        )}
    </article>
  );
}