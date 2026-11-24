import { useState } from "react";
import {
  Truck,
  RotateCcw,
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Footprints,
  ChevronDown,
} from "lucide-react";
import "./Header.css";

/* ---------- Config (edit here, not in the JSX) ---------- */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const TOP_BAR_LINKS = [
  { label: "Why StepNova", href: "#" },
  { label: "Help & Support", href: "#" },
];

/* ---------- Small reusable pieces ---------- */
export function Logo({ light = false }) {
  return (
    <a href="/" className="flex items-center gap-2.5" aria-label="StepNova home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8] text-white shadow-sm shadow-blue-900/20">
        <Footprints className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-[20px] font-extrabold tracking-tight ${
            light ? "text-white" : "text-[#0F172A]"
          }`}
        >
          StepNova
        </span>
        <span className="mt-1 text-[8px] font-bold tracking-[0.12em] text-[#2563EB]">
          WALK BETTER. LIVE BOLDER.
        </span>
      </span>
    </a>
  );
}

function IconButton({ label, badge, children, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full text-[#0F172A] transition-colors duration-200 hover:bg-[#E0E7FF] hover:text-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${className}`}
    >
      {children}
      {badge !== undefined && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#1D4ED8] px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function SearchField({ className = "" }) {
  return (
    <label
      className={`flex items-center gap-2 rounded-full bg-[#E8ECFF] px-4 py-2.5 text-[#0F172A] transition-shadow duration-200 focus-within:ring-2 focus-within:ring-[#2563EB] ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-slate-500" />
      <input
        type="search"
        placeholder="Search shoes, brands..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
      />
    </label>
  );
}

/* ---------- Header ---------- */
export default function Header({ cartCount = 0, wishlistCount = 0, activePath = "/" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Announcement bar */}
      <div className="bg-[#0F172A] text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-[11px] font-medium sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-[#38BDF8]" />
              Free Delivery On Orders Over $2,000
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <RotateCcw className="h-3.5 w-3.5 text-[#38BDF8]" />
              7-Day Hassle-Free Returns
            </span>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            {TOP_BAR_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="transition-colors hover:text-[#38BDF8]">
                {l.label}
              </a>
            ))}
            <button
              type="button"
              className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 transition-colors hover:bg-white/20"
            >
              $ BDT <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((l) => {
              const active = l.href === activePath;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "bg-[#E0E7FF] text-[#1D4ED8]"
                      : "text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#1D4ED8]"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop search */}
          <SearchField className="hidden w-64 lg:flex xl:w-72" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <IconButton label="Wishlist" badge={wishlistCount} className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </IconButton>
            <IconButton label="Cart" badge={cartCount}>
              <ShoppingBag className="h-5 w-5" />
            </IconButton>
            <button
              type="button"
              className="ml-2 hidden items-center gap-1 rounded-full bg-[#E8ECFF] px-3 py-1.5 text-xs font-semibold text-[#0F172A] transition-colors hover:bg-[#DCE3FF] md:flex"
            >
              $ BDT
            </button>
            <IconButton
              label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </IconButton>
          </div>
        </div>

        {/* Mobile / tablet panel */}
        <div
          className={`grid transition-all duration-300 ease-out md:hidden ${
            menuOpen ? "grid-rows-[1fr] border-t border-slate-200/70" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 px-4 py-4 sm:px-6">
              <SearchField />
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((l) => {
                  const active = l.href === activePath;
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#E0E7FF] text-[#1D4ED8]"
                          : "text-[#0F172A] hover:bg-[#EEF2FF]"
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </nav>
              <div className="flex items-center gap-4 border-t border-slate-200 pt-3 text-xs font-medium text-slate-600">
                {TOP_BAR_LINKS.map((l) => (
                  <a key={l.label} href={l.href} className="hover:text-[#1D4ED8]">
                    {l.label}
                  </a>
                ))}
                <span className="ml-auto rounded bg-[#E8ECFF] px-2 py-1 font-semibold text-[#0F172A]">$ BDT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
