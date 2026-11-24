import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { buildOrderLink } from "../utils/whatsapp";
import { siteConfig } from "../data/siteConfig";
import NotFound from "./NotFound";
import RelatedProducts from "../components/common/RelatedProducts/RelatedProducts";


const DEFAULT_SIZES = [
  { size: 39 },
  { size: 40 },
  { size: 41 },
  { size: 42 },
  { size: 43 },
  { size: 44 },
  { size: 45, disabled: true },
];

const DEFAULT_FEATURES = [
  "Premium leather and synthetic upper for lasting durability",
  "Encapsulated Nike Air sole cushioning for lightweight impact absorption",
  "Perforations on the toe box for optimal ventilation",
  "Padded low-cut collar looks sleek and feels comfortable",
  "Non-marking rubber outsole with classic pivot circle pattern",
];

const formatPrice = (value) =>
  typeof value === "number" ? `৳${value.toLocaleString("en-US")}` : value;

function ChevronRight() {
  return (
    <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
    </svg>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const { getProductById, loading } = useProducts();
  const product = getProductById(id);

  const [selectedSize, setSelectedSize] = useState(null); // null = first size is used
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  // Direct visit to /product/10: wait for the API before deciding "not found"
  if (loading) {
    return (
      <p className="py-24 text-center font-['Plus_Jakarta_Sans',sans-serif] text-sm text-slate-500">
        Loading product...
      </p>
    );
  }

  if (!product) {
    return (
      <NotFound
        title="Product not found"
        message="This product doesn't exist or may have been removed."
      />
    );
  }

  const sizes = product.sizes?.length
    ? product.sizes.map((s) => (typeof s === "object" ? s : { size: s }))
    : DEFAULT_SIZES;
  // nothing picked yet -> first size of this product is selected
  const activeSize = selectedSize ?? sizes[0]?.size;
  const features = product.features?.length ? product.features : DEFAULT_FEATURES;
  const image = product.image || product.images?.[0];
  const category = product.category || "Sneakers";
  const phone = product.phone || siteConfig.phone;
  const hasDiscount =
    typeof product.discountPrice === "number" && product.discountPrice < product.price;

  // "Order Now" and "Message Now" both open WhatsApp with product, size and quantity already typed
  const messageUrl = buildOrderLink(
    { ...product, category, brand: product.brand || product.name.split(" ")[0] },
    { size: activeSize, quantity, url: window.location.href }
  );

  return (
    <section className="font-['Plus_Jakarta_Sans',sans-serif] bg-[#F8FAFF]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1 hover:text-[#2563EB]">
            <HomeIcon />
            Home
          </Link>
          <ChevronRight />
          <Link to="/" className="hover:text-[#2563EB]">
            {category}
          </Link>
          <ChevronRight />
          <span className="font-semibold text-[#0F172A]">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E2E8F0] bg-[#E8EDF5] shadow-sm lg:aspect-auto lg:h-full lg:min-h-[360px]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                No image available
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {(product.id || product.sku) && (
                <p className="mt-5 text-[11px] text-slate-400">
                  Product ID: {product.id}
                  {product.sku ? ` · SKU: ${product.sku}` : ""}
                </p>
              )}

            <h1 className="mt-3 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {product.tagline || "Timeless style. All-day comfort."}
            </p>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-3xl font-extrabold text-[#1D4ED8]">
                {formatPrice(hasDiscount ? product.discountPrice : product.price)}
              </p>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Size */}
            <div className="mt-5">
              <p className="text-xs font-bold text-[#0F172A]">Size:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map(({ size, disabled }) => {
                  const active = activeSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedSize(size)}
                      className={`h-9 min-w-[40px] rounded-lg border px-3 text-xs font-bold transition ${
                        active
                          ? "border-[#1D4ED8] bg-[#1D4ED8] text-white shadow-md shadow-blue-200"
                          : disabled
                          ? "cursor-not-allowed border-[#E2E8F0] bg-[#F1F5F9] text-slate-300"
                          : "border-[#DBEAFE] bg-white text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-5">
              <p className="text-xs font-bold text-[#0F172A]">Quantity:</p>
              <div className="mt-2 inline-flex items-center rounded-full border border-[#CBD5E1] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-slate-600 hover:text-[#2563EB]"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold text-[#0F172A]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-slate-600 hover:text-[#2563EB]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Order Now (full width, opens the same WhatsApp message as "Message Now") */}
            <a
              href={messageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-[#2563EB] active:scale-[0.99] sm:text-base"
            >
              <BagIcon />
              Order Now
            </a>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${phone}`}
                className="inline-flex h-11 min-w-[140px] flex-1 items-center justify-center gap-2 rounded-full border border-[#1D4ED8] bg-white px-5 text-xs sm:text-sm md:text-base font-bold text-[#1D4ED8] transition hover:bg-[#EFF6FF]"
              >
                <PhoneIcon />
                Call Now
              </a>
              <a
                href={messageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 min-w-[140px] flex-1 items-center justify-center gap-2 rounded-full bg-[#1D4ED8] px-5 text-xs sm:text-sm md:text-base font-bold text-white shadow-md shadow-blue-200 transition hover:bg-[#2563EB]"
              >
                <WhatsAppIcon />
                Message Now
              </a>
            </div>

            <hr className="my-6 border-[#E2E8F0]" />

            {/* Details */}
            <div>
              <h2 className="text-sm font-extrabold text-[#0F172A]">
                Product Details &amp; Features
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-[#1D4ED8]/80">
                {product.description ||
                  "The Nike Air Force 1 '07 puts a fresh spin on the iconic basketball legend. Featuring crisp leather overlays, bold royal blue accents, and an encapsulated Nike Air unit, it delivers unmatched cushioning and timeless street style built for all-day comfort."}
              </p>

              <ul className="mt-4 space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                    {feature}
                  </li>
                ))}
              </ul>

              
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts product={product} />

    </section>
  );
}