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
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-6 lg:px-8">
        {/*
          ONE bar on every screen: 3 items side by side with dividers
          <480px  : icon only (no box), small 2-line title
          480px+  : icon box + bigger title
          sm 640+ : + description
        */}
        <div className="grid grid-cols-3 items-center divide-x divide-slate-300/70 rounded-2xl bg-[#EEF4FF] px-1 py-3 shadow-sm min-[480px]:px-2 min-[480px]:py-3.5 sm:py-4 md:py-5">
          {items.map(({ id, icon: Icon, title, text }, i) => (
            <div
              key={id}
              style={{ "--i": i }}
              className="feature-item flex min-w-0 items-center justify-center gap-1.5 px-1.5 min-[480px]:gap-2.5 min-[480px]:px-3 sm:gap-3 sm:px-4 md:gap-4"
            >
              <span className="feature-icon flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-transparent text-[#1D4ED8] min-[480px]:h-9 min-[480px]:w-9 min-[480px]:rounded-xl min-[480px]:bg-white sm:h-11 sm:w-11 md:h-12 md:w-12">
                <Icon
                  className="h-[18px] w-[18px] min-[480px]:h-4 min-[480px]:w-4 sm:h-5 sm:w-5"
                  strokeWidth={2}
                />
              </span>
              <div className="min-w-0">
                <h3 className="text-balance text-[10.5px] font-bold leading-[1.15] text-[#0F172A] min-[480px]:text-xs sm:text-sm">
                  {title}
                </h3>
                {/* description: mobile-e hide, tablet+ e show */}
                <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}