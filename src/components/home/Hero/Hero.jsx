import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { heroSlides } from "../../../data/heroSlides";
import { IMAGE_URL } from "../../../data/products"; // path tomar folder onujayi thik koro
import { Link } from "react-router-dom";
import "./Hero.css";

const AUTOPLAY_MS = 5000; // <-- auto-slide speed (5000 = 5 second)

const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

// "https://..."            -> jemon ache
// "/uploads/a.mp4"         -> backend URL + path
// "images/slider/a.webp"   -> "/images/slider/a.webp" (local public folder)
const resolveSrc = (src) => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/uploads")) return `${IMAGE_URL}${src}`;
  return src.startsWith("/") ? src : `/${src}`;
};

// Slide theke media ber kore: video hole { type: "video" }, na hole { type: "image" }
// Backend field jei nam e ashuk (media, video, video_url, image, image_url) kaj korbe
function getMedia(slide) {
  const raw =
    slide.video || slide.video_url || slide.media || slide.image || slide.image_url || "";
  const src = resolveSrc(raw);
  const declared = String(slide.mediaType || slide.media_type || slide.type || "").toLowerCase();
  const isVideo = declared === "video" || (declared !== "image" && VIDEO_EXT.test(src));
  return {
    type: isVideo ? "video" : "image",
    src,
    poster: resolveSrc(slide.poster || slide.thumbnail || ""),
  };
}

const MEDIA_CLASS =
  "block h-auto max-h-[280px] w-auto max-w-full rounded-lg object-contain shadow-2xl shadow-black/40 ring-1 ring-white/10 min-[480px]:max-h-[320px] sm:max-h-[400px] md:max-h-[500px]";

function HeroMedia({ slide }) {
  const { type, src, poster } = getMedia(slide);

  if (!src) return null;

  if (type === "video") {
    return (
      <video
        key={src}
        src={src}
        poster={poster || undefined}
        className={MEDIA_CLASS}
        autoPlay
        muted // browser e autoplay er jonno muted must
        loop
        playsInline
        preload="metadata"
        aria-label={slide.imageAlt || slide.alt || "Hero video"}
      />
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt={slide.imageAlt || slide.alt || ""}
      className={MEDIA_CLASS}
    />
  );
}

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
    "flex items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

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
      {/* Gradient color change korte chaile index.css e --color-hero-from/via/to bodlao */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-hero-from via-hero-via to-hero-to">
        {/*
          Slide layout (always side by side, never stacked):
          mobile  : text 58% | image 42%
          desktop : text 60% | 5% gap | image 35%
          Size steps: <480px (small) -> 480px+ (medium) -> sm 640px -> md 768px -> lg 1024px -> xl 1280px
        */}
        <div
          key={slide.id}
          className="hero-slide grid grid-cols-[1.35fr_1fr] items-center gap-3 px-4 pb-14 pt-5 min-[480px]:gap-5 min-[480px]:px-7 min-[480px]:pb-14 min-[480px]:pt-6 sm:gap-6 sm:px-10 sm:pb-16 sm:pt-8 md:grid-cols-[6fr_0.5fr_3.5fr] md:gap-0 md:px-16 md:py-14 lg:px-20"
        >
          <div className="flex min-w-0 flex-col items-start">
            <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-accent-200 ring-1 ring-white/10 backdrop-blur min-[480px]:gap-1.5 min-[480px]:px-3 min-[480px]:py-1 min-[480px]:text-[11px] sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs">
              <Zap className="h-2.5 w-2.5 shrink-0 fill-star text-star min-[480px]:h-3 min-[480px]:w-3 sm:h-3.5 sm:w-3.5" />
              <span className="truncate">{slide.badge}</span>
            </span>

            <p className="mt-2 text-[10px] font-semibold leading-snug text-accent-300 min-[480px]:mt-3 min-[480px]:text-sm sm:mt-4 sm:text-base md:text-xl">
              {slide.subtitle}
            </p>

            {/* Heading size change korte: text-base min-[480px]:text-2xl sm:text-3xl lg:text-5xl xl:text-[64px] */}
            <h1 className="mt-1.5 text-base font-extrabold uppercase leading-[1.1] tracking-tight text-white min-[480px]:mt-2 min-[480px]:text-2xl sm:mt-3 sm:text-3xl lg:text-5xl xl:text-[64px]">
              {slide.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-3 flex flex-wrap justify-center gap-2 min-[480px]:mt-5 sm:mt-7 sm:gap-4 md:justify-start">
              {/* Shop Now -> /shop page */}
              <Link
                to="/shop"
                className="rounded-lg bg-white px-3 py-1.5 text-center text-[9px] font-extrabold uppercase tracking-wide text-ink transition duration-200 hover:bg-accent-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-[480px]:px-4 min-[480px]:py-2 min-[480px]:text-xs sm:px-5 sm:py-2.5"
              >
                {slide.primaryCta.label}
              </Link>
            </div>
          </div>

          {/* Media (always right): image hole <img>, video hole <video> */}
          <div className="flex min-w-0 items-center justify-center md:col-start-3">
            <HeroMedia slide={slide} />
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
                      i === index ? "w-6 bg-accent" : "w-1.5 bg-white/40 hover:bg-white/70"
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