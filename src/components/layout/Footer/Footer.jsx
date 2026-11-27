import { useState } from "react";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "../Header/Header";
import "./Footer.css";

/* ---------- Config ---------- */
const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Contact Us", href: "/contact" },
  { label: "Size Guide", href: "/size-guide" },
];

const CUSTOMER_CARE = [
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "Return Policy", href: "/returns" },
  { label: "Track Order", href: "/track-order" },
  { label: "Store Locator", href: "/stores" },
];

const CONTACT = [
  { icon: Phone, text: "+97455296021", href: "tel:+97455296021" },
  { icon: Mail, text: "admin@velaroqa.com", href: "mailto:admin@velaroqa.com" },
  {
    icon: MapPin,
    text: "Al Muntazah, Doha, Qatar, 10295",
    href: "https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&FORM=FBKPL1&q=Al+Muntazah%2C+Doha%2C+Qatar%2C+10295&cp=25.265549%7E51.523525&lvl=16&style=r",
  },
];

const SOCIALS = [
  { label: "Facebook", icon: Facebook, href: "https://www.facebook.com/akaglobalshop?rdid=ZHUSHHp3BxTvNND3&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GnmQ6agFA%2F#" },
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/velarofashion_974" },
];

/* ---------- Reusable pieces ---------- */
function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-[11px] font-bold tracking-[0.1em] text-accent">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-xs text-slate-300 transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Footer ---------- */
export default function Footer() {
  const [email, setEmail] = useState("");

  // UI only: no backend per the brief.
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer id="contact" className="bg-ink font-['Plus_Jakarta_Sans',sans-serif] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand + newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-300">
              velaro brings premium footwear engineered for everyday confidence and street
              performance. Built for walkers, athletes, and style creators.
            </p>

            <h3 className="mb-1 mt-6 text-[11px] font-bold tracking-[0.1em] text-white">
              SUBSCRIBE TO OUR NEWSLETTER
            </h3>
            <p className="mb-3 text-[11px] text-accent">
              Get insider drops &amp; exclusive offers straight to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex max-w-sm gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="rounded-md bg-primary-dark px-4 py-2.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition-colors duration-200 hover:border-primary hover:bg-primary-dark hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="QUICK LINKS" links={QUICK_LINKS} />
          <LinkColumn title="CUSTOMER CARE" links={CUSTOMER_CARE} />

          {/* Contact (clickable: tel, mailto, Google Maps) */}
          <div>
            <h3 className="mb-4 text-[11px] font-bold tracking-[0.1em] text-accent">CONTACT</h3>
            <ul className="space-y-3">
              {CONTACT.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-start gap-2.5 text-xs text-slate-300 transition-colors duration-200 hover:text-white"
                  >
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} velaro. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/privacy" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="/terms" className="transition-colors hover:text-white">Terms of Service</a>
            <span>velaro — Walk Better. Live Bolder.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}