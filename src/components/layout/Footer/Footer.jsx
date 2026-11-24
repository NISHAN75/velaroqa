import { useState } from "react";
import { Facebook, Youtube, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "../Header/Header";
import "./Footer.css";

/* ---------- Config ---------- */
const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
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
  { icon: Phone, text: "+880 1700-000000" },
  { icon: Mail, text: "support@Velaroqa.com" },
  { icon: MapPin, text: "GEC Circle, Chattogram, Bangladesh" },
];

// lucide-react has no TikTok icon, so a small inline SVG is used (no extra package).
const TikTok = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v3.1c-1.4.1-2.7-.3-3.9-1.1v6.1c0 3.9-3.2 6-6.2 5.4-2.5-.5-4.3-2.8-4-5.4.3-2.9 2.9-4.9 5.8-4.4v3.2c-1.5-.5-3 .5-3 2 0 1.3 1.1 2.2 2.3 2 1-.2 1.6-1 1.6-2.1V3h3.5z" />
  </svg>
);

const SOCIALS = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "TikTok", icon: TikTok, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
];

/* ---------- Reusable pieces ---------- */
function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-[11px] font-bold tracking-[0.1em] text-[#38BDF8]">{title}</h3>
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
    <footer id="contact" className="bg-[#0F172A] font-['Plus_Jakarta_Sans',sans-serif] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand + newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-300">
              Velaroqa brings premium footwear engineered for everyday confidence and street
              performance. Built for walkers, athletes, and style creators.
            </p>

            <h3 className="mb-1 mt-6 text-[11px] font-bold tracking-[0.1em] text-white">
              SUBSCRIBE TO OUR NEWSLETTER
            </h3>
            <p className="mb-3 text-[11px] text-[#38BDF8]">
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
                className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-500 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
              <button
                type="submit"
                className="rounded-md bg-[#1D4ED8] px-4 py-2.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
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
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition-colors duration-200 hover:border-[#2563EB] hover:bg-[#1D4ED8] hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="QUICK LINKS" links={QUICK_LINKS} />
          <LinkColumn title="CUSTOMER CARE" links={CUSTOMER_CARE} />

          {/* Contact (placeholder content) */}
          <div>
            <h3 className="mb-4 text-[11px] font-bold tracking-[0.1em] text-[#38BDF8]">CONTACT</h3>
            <ul className="space-y-3">
              {CONTACT.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#38BDF8]" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Velaroqa. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/privacy" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="/terms" className="transition-colors hover:text-white">Terms of Service</a>
            <span>Velaroqa — Walk Better. Live Bolder.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
