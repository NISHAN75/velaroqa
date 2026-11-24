import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { heroSlides } from "../../../data/heroSlides";
import { Link } from "react-router-dom";
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

  const arrowBase =
    "flex items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]";

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-3 font-['Plus_Jakarta_Sans',sans-serif] sm:px-6 sm:py-4 lg:px-8"
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
          className="hero-slide grid items-center gap-5 px-5 pb-16 pt-6 sm:gap-6 sm:px-10 sm:pt-8 md:grid-cols-[6fr_0.5fr_3.5fr] md:gap-0 md:px-16 md:py-14 lg:px-20"
        >
          {/* Text (60%) */}
          <div className="order-2 md:order-1 md:col-start-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#BAE6FD] ring-1 ring-white/10 backdrop-blur sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs">
              <Zap className="h-3 w-3 fill-[#FACC15] text-[#FACC15] sm:h-3.5 sm:w-3.5" />
              {slide.badge}
            </span>

            <p className="mt-3 text-sm font-semibold text-[#7DD3FC] sm:mt-4 sm:text-base md:text-xl">
              {slide.subtitle}
            </p>

            {/* Heading size change korte: text-2xl sm:text-4xl lg:text-5xl xl:text-[64px] */}
            <h1 className="mt-2 text-2xl font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl xl:text-[64px]">
              {slide.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-5 flex gap-3 sm:mt-7 sm:gap-4">
              {/* Shop Now -> /shop page */}
              <Link
                to="/shop"
                className="flex-1 rounded-lg bg-white px-4 py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-[#0F172A] transition duration-200 hover:bg-[#E0F2FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] sm:flex-none sm:px-5 sm:py-2.5 sm:text-xs"
              >
                {slide.primaryCta.label}
              </Link>

              {/* Categories -> section with id="categories" */}
              <a
                href="#categories"
                className="flex-1 rounded-lg border border-white/70 px-4 py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-white transition duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] sm:flex-none sm:px-5 sm:py-2.5 sm:text-xs"
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
              className="block h-auto max-h-[280px] w-auto max-w-full rounded-lg object-contain shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:max-h-[400px] md:max-h-[500px]"
            />
          </div>
        </div>

        {count > 1 && (
          <>
            {/* Side arrows: tablet + desktop only */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className={`${arrowBase} absolute left-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 md:flex`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className={`${arrowBase} absolute right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 md:flex`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Bottom controls: mobile = arrow + dots + arrow, desktop = dots only */}
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3 sm:bottom-4">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className={`${arrowBase} h-7 w-7 md:hidden`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
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

              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className={`${arrowBase} h-7 w-7 md:hidden`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}