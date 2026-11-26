
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buildOrderLink } from "../../../utils/whatsapp";

import "./FeaturedProducts.css";

const formatPrice = (n) =>
  `QR ${n.toLocaleString("en-US")}`;

export default function FeaturedProductCard({ product }) {
  const {
    id,
    name,
    category,
    price,
    discountPrice,
    image,
    isNew,
  } = product;

  //  category fallback
  const productCategory = category || "Sneakers";

  // Discount calculation
  const hasDiscount =
    typeof discountPrice === "number" &&
    discountPrice < price;

  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Product details page URL
  const productUrl = `/product/${id}`;

  // WhatsApp order link
  const orderHref = buildOrderLink(
    {
      ...product,
      category: productCategory,
    },
    {
      url: `${window.location.origin}${productUrl}`,
    }
  );

  return (
    <article className="featured-card flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60">

      {/* Product Image */}
      <Link
        to={productUrl}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/3] overflow-hidden bg-[#F3F6FB]"
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="featured-img h-full w-full object-cover"
        />

        {/* New Badge */}
        {isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-[#2563EB] px-2 py-0.5 text-[9px] font-bold text-white">
            New
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute right-2 top-2 rounded-full bg-[#0F172A] px-2 py-0.5 text-[9px] font-bold text-[#38BDF8]">
            -{discountPercent}%
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-3">

        {/* Product Name */}
        <h3 className="mt-1 line-clamp-1 text-sm font-bold text-[#0F172A]">
          <Link
            to={productUrl}
            className="hover:text-[#1D4ED8]"
          >
            {name}
          </Link>
        </h3>

        {/* Price and Order Button */}
        <div className="mt-auto pt-3">

          {/* Product Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-[#0F172A]">
              {formatPrice(hasDiscount ? discountPrice : price)}
            </span>

            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* WhatsApp Order Button */}
          <a
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-cta mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#F3F6FB] py-2 text-[11px] font-bold text-[#1D4ED8] transition duration-200 hover:bg-[#2563EB] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2"
          >
            Order Now

            <ArrowRight className="featured-arrow h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>

        </div>
      </div>
    </article>
  );
}
