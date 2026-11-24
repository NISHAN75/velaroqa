import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ✏️ Change the banner text, code, link and image here
const PROMO = {
  badge: "Special Offer",
  title: "Get 30% OFF",
  subtitle: "On Your First Order. Limited Time Celebration Offer!",
  code: "STEP30",
  buttonText: "Shop Now",
  buttonLink: "/shop",
  image: "/images/products/products-08.png", // put your image in public/images/promo/
  imageAlt: "Black and orange running shoe",
};

export default function PromoBanner({ promo = PROMO }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available: ignore */
    }
  };

  return (
    <section
      aria-label="Special offer"
      className="font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] shadow-xl shadow-blue-900/20">
          {/* soft glow on the right */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#38BDF8]/20 blur-3xl" />

          <div className="relative flex flex-col-reverse items-center gap-6 p-6 sm:p-8 md:flex-row md:justify-between md:gap-8 md:px-10 md:py-9">
            {/* Text */}
            <div className="w-full md:max-w-[55%]">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                {promo.badge}
              </span>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                {promo.title}
              </h2>
              <p className="mt-2 text-xs text-white/90 sm:text-sm">{promo.subtitle}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {/* Coupon code (click to copy) */}
                <button
                  type="button"
                  onClick={copyCode}
                  aria-label={`Copy coupon code ${promo.code}`}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0F172A]/60 px-3 py-2 transition hover:bg-[#0F172A]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                >
                  <span className="text-[9px] font-bold uppercase tracking-wide text-white/70">
                    {copied ? "Copied!" : "Use Code:"}
                  </span>
                  <span className="font-mono text-xs font-bold tracking-wider text-[#FACC15]">
                    {promo.code}
                  </span>
                </button>

                {/* Shop button */}
                <Link
                  to={promo.buttonLink}
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[11px] font-bold text-[#1D4ED8] shadow-sm transition duration-200 hover:bg-[#F3F6FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D4ED8]"
                >
                  {promo.buttonText}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="w-full md:w-[40%]">
              <img
                src={promo.image}
                alt={promo.imageAlt}
                loading="lazy"
                className="aspect-[16/10] w-full rounded-xl object-cover shadow-2xl shadow-blue-950/40 ring-1 ring-white/20 md:[transform:perspective(900px)_rotateY(-8deg)_rotateZ(2deg)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}