import { Star } from "lucide-react";
import { testimonials } from "../../../data/testimonials";

const getInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Testimonials({ items = testimonials }) {
  if (!items.length) return null;

  return (
    <section
      aria-labelledby="testimonials-title"
      className="font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-7 text-center">
          <h2
            id="testimonials-title"
            className="mt-1.5 text-2xl font-extrabold text-[#0F172A] sm:text-3xl"
          >
            What Our Walkers Say
          </h2>
          <p class="mt-0.5 text-[11px] text-slate-500 sm:text-xs">Discover our latest collection</p>
        </div>

        {/* Cards: 1 column on mobile, 3 on tablet and desktop */}
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Stars */}
              <div className="flex gap-0.5" role="img" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < t.rating
                        ? "fill-[#FBBF24] text-[#FBBF24]"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Review */}
              <blockquote className="mt-3 flex-1 text-xs leading-relaxed text-slate-600">
                “{t.text}”
              </blockquote>

              {/* Reviewer */}
              <figcaption className="mt-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8EDF5] text-[10px] font-bold text-slate-600"
                >
                  {getInitials(t.name)}
                </span>
                <div>
                  <p className="text-[11px] font-bold text-[#0F172A]">{t.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Verified Buyer • {t.city}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}