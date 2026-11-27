import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// ✏️ Change the banner image, button, link and code here
const PROMO = {
  image: "/images/promo/velaro-banner.webp", // put your image in public/images/promo/
  imageAlt: "Velaro - Step into luxury. Suede loafers, monk strap shoes and leather sandals",
  buttonText: "Shop Now",
  buttonLink: "/shop",
  code: "STEP30", // code dekhate na chaile "" (khali) rakho
};

function Controls({ promo, center = false }) {
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
    <div
      className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${
        center ? "justify-center" : ""
      }`}
    >
      <Link
        to={promo.buttonLink}
        className="group inline-flex items-center gap-1.5 bg-dark px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-200 hover:bg-dark-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 lg:px-7 lg:py-3 lg:text-xs"
      >
        {promo.buttonText}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>

      {promo.code && (
        <button
          type="button"
          onClick={copyCode}
          aria-label={`Copy coupon code ${promo.code}`}
          className="flex items-center gap-2 border border-dark/25 bg-white px-4 py-2.5 transition hover:border-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 lg:py-3"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-dark/60">
            {copied ? "Copied" : "Code"}
          </span>
          <span className="font-mono text-xs font-bold tracking-widest text-dark">
            {promo.code}
          </span>
        </button>
      )}
    </div>
  );
}

export default function PromoBanner({ promo = PROMO }) {
  return (
    <section aria-label="Velaro collection" className="font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/70">
          <div className="relative">
            {/* Banner image: full image, same as design (no crop) */}
            <img
              src={promo.image}
              alt={promo.imageAlt}
              loading="lazy"
              width="1600"
              height="954"
              className="block h-auto w-full"
            />

            {/*
              Tablet + desktop: controls sit centered right under
              "— STEP INTO LUXURY —" line, aligned to the logo block
              (logo block = 9.1% → 52.8% of image width).
            */}
            <div className="absolute left-[9.1%] top-[72%] hidden w-[43.7%] md:block">
              <Controls promo={promo} center />
            </div>
          </div>

          {/* Mobile: image er niche, centered */}
          <div className="bg-white px-4 pb-5 pt-1 md:hidden">
            <Controls promo={promo} center />
          </div>
        </div>
      </div>
    </section>
  );
}