import { useEffect, useRef, useState } from "react";
import { features } from "../../../data/features";
import "./Features.css";

export default function Features({ items = features }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  // Start the reveal animation once, when the bar scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Store benefits"
      className={`font-['Plus_Jakarta_Sans',sans-serif] ${visible ? "features-visible" : ""}`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 md:gap-8 lg:px-8">
        {items.map(({ id, icon: Icon, title, text }, i) => (
          <div
            key={id}
            style={{ "--i": i }}
            className="feature-item flex items-center gap-4 md:justify-center"
          >
            <span className="feature-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1D4ED8]">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}