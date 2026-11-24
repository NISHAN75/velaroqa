import { ArrowRight } from "lucide-react";
import { categories } from "../../../data/categories";
import "./Categories.css";

export default function Categories({ items = categories }) {
  return (
    <section
      aria-label="Shop by category"
      className="scroll-mt-20  font-['Plus_Jakarta_Sans',sans-serif]"
      id="categories"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:px-6  sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 lg:px-8">
        {items.map((cat) => (
          <a
            key={cat.id}
            href={cat.href}
            aria-label={`Shop ${cat.name}`}
            className="category-card group relative block aspect-[5/4] overflow-hidden rounded-2xl bg-[#0B2A8A] shadow-lg shadow-blue-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-2"
          >
            {/* Background image: full width + full height */}
            <img
              src={cat.image}
              alt=""
              loading="lazy"
              className="category-img absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark shade top and bottom so the text stays readable */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />

            {/* Text (top-left) */}
            <div className="relative z-10 p-4">
              <h3 className="text-base font-extrabold leading-tight text-white sm:text-lg">
                {cat.name}
              </h3>
              <p className="mt-0.5 text-[11px] font-medium text-[#BAE6FD] sm:text-xs">
                {cat.tagline}
              </p>
            </div>

            {/* CTA (bottom-left) */}
            <span className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 text-[11px] font-bold text-white sm:text-xs">
              Shop {cat.name}
              <ArrowRight className="category-arrow h-3.5 w-3.5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}