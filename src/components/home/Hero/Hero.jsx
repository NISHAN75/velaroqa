import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { heroSlides } from "../../../data/heroSlides";
import "./Hero.css";

const AUTOPLAY_MS = 5000; // <-- auto-slide speed (5000 = 5 second)

export default function Hero({ slides = heroSlides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, next, count]);

  const slide = slides[index];

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-4 font-['Plus_Jakarta_Sans',sans-serif] sm:px-6 lg:px-8"
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Gradient color change korte chaile ei line-er from/via/to bodlao */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1730] via-[#0A3A78] to-[#0284C7]">
        {/* Slide: desktop-e 60% content | 5% gap | 35% image */}
        <div
          key={slide.id}
          className="hero-slide grid items-center gap-8 px-6 pb-14 pt-10 sm:px-14 md:grid-cols-[6fr_0.5fr_3.5fr] md:gap-0 md:px-16 md:py-14 lg:px-20"
        >
          {/* Text (60%) */}
          <div className="order-2 md:order-1 md:col-start-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#BAE6FD] ring-1 ring-white/10 backdrop-blur">
              <Zap className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" />
              {slide.badge}
            </span>

            <p className="mt-5 text-lg font-semibold text-[#7DD3FC] md:text-xl">{slide.subtitle}</p>

            {/* Heading size change korte: md:text-5xl lg:text-[56px] xl:text-[72px] */}
            <h1 className="mt-4 text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[56px] xl:text-[72px]">
              {slide.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={slide.primaryCta.href}
                className="rounded-lg bg-white px-8 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#0F172A] transition duration-200 hover:bg-[#E0F2FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                {slide.primaryCta.label}
              </a>
              <a
                href={slide.secondaryCta.href}
                className="rounded-lg border border-white/70 px-8 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white transition duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
              >
                {slide.secondaryCta.label}
              </a>
            </div>
          </div>

          {/* Image (35%) */}
          <div className="order-1 flex justify-center md:order-2 md:col-start-3">
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="block h-auto max-h-[400px] w-auto max-w-full rounded-lg object-contain shadow-2xl shadow-black/40 ring-1 ring-white/10 md:max-h-[400px]"
            />
          </div>
        </div>

        {/* Arrows + dots */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] sm:right-4"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-[#38BDF8]" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}