import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Footprints } from "lucide-react";
import "./Header.css";

/* ---------- Config (edit here, not in the JSX) ---------- */
// match = ei path gulo te thakle link ta active dekhabe
const NAV_LINKS = [
  { label: "Home", href: "/", match: ["/"] },
  { label: "Shop", href: "/shop", match: ["/shop", "/product"] },
  { label: "Contact", href: "#contact", hash: "#contact" },
];

const TOP_BAR_LINKS = [
  { label: "Why Velaroqa", href: "#" },
  { label: "Help & Support", href: "#" },
];

/* ---------- Which link is active on the current page ---------- */
function isLinkActive(link, { pathname, hash }) {
  // Contact = home page er #contact section
  if (link.hash) return pathname === "/" && hash === link.hash;

  // Home = only "/" (and not while Contact section is selected)
  if (link.href === "/") return pathname === "/" && hash !== "#contact";

  // Shop = /shop and /shop/... and /product/:id
  return link.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

/* ---------- Small reusable pieces ---------- */
export function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Velaroqa home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8] text-white shadow-sm shadow-blue-900/20">
        <Footprints className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-[20px] font-extrabold tracking-tight ${
            light ? "text-white" : "text-[#0F172A]"
          }`}
        >
          Velaroqa
        </span>
        <span className="mt-1 text-[8px] font-bold tracking-[0.12em] text-[#2563EB]">
          WALK BETTER. LIVE BOLDER.
        </span>
      </span>
    </Link>
  );
}

function IconButton({ label, children, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full text-[#0F172A] transition-colors duration-200 hover:bg-[#E0E7FF] hover:text-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${className}`}
    >
      {children}
    </button>
  );
}

// Enter chaple (ba search icon e click korle) onSubmit call hoy
function SearchField({ value, onChange, onSubmit, className = "" }) {
  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={`flex items-center gap-2 rounded-full bg-[#E8ECFF] px-4 py-2.5 text-[#0F172A] transition-shadow duration-200 focus-within:ring-2 focus-within:ring-[#2563EB] ${className}`}
    >
      <button type="submit" aria-label="Search" className="shrink-0">
        <Search className="h-4 w-4 text-slate-500" />
      </button>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search shoes, brands..."
        aria-label="Search shoes, brands"
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
      />
    </form>
  );
}

/* ---------- Header ---------- */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // On /shop keep the header box in sync with the ?q= in the URL
  useEffect(() => {
    if (location.pathname === "/shop") {
      setSearchText(new URLSearchParams(location.search).get("q") || "");
    }
  }, [location.pathname, location.search]);

  // Close the mobile menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    setMenuOpen(false);
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  // Contact link: on home just scroll to #contact, from other pages go to /#contact
  const renderLink = (l, className, onClick) => {
    const active = isLinkActive(l, location);
    const common = {
      className: className(active),
      "aria-current": active ? "page" : undefined,
      onClick,
    };

    if (l.hash) {
      return (
        <a key={l.label} {...common} href={location.pathname === "/" ? l.hash : l.href}>
          {l.label}
        </a>
      );
    }
    return (
      <Link key={l.label} {...common} to={l.href}>
        {l.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Main bar */}
      <div className="border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((l) =>
              renderLink(
                l,
                (active) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "bg-[#E0E7FF] text-[#1D4ED8]"
                      : "text-[#0F172A] hover:bg-[#EEF2FF] hover:text-[#1D4ED8]"
                  }`
              )
            )}
          </nav>

          {/* Desktop search */}
          <SearchField
            value={searchText}
            onChange={setSearchText}
            onSubmit={handleSearch}
            className="hidden w-64 lg:flex xl:w-72"
          />

          {/* Mobile menu button */}
          <IconButton
            label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </IconButton>
        </div>

        {/* Mobile / tablet panel */}
        <div
          className={`grid transition-all duration-300 ease-out md:hidden ${
            menuOpen ? "grid-rows-[1fr] border-t border-slate-200/70" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 px-4 py-4 sm:px-6">
              <SearchField
                value={searchText}
                onChange={setSearchText}
                onSubmit={handleSearch}
              />
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((l) =>
                  renderLink(
                    l,
                    (active) =>
                      `rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#E0E7FF] text-[#1D4ED8]"
                          : "text-[#0F172A] hover:bg-[#EEF2FF]"
                      }`,
                    () => setMenuOpen(false)
                  )
                )}
              </nav>
              <div className="flex items-center gap-4 border-t border-slate-200 pt-3 text-xs font-medium text-slate-600">
                {TOP_BAR_LINKS.map((l) => (
                  <a key={l.label} href={l.href} className="hover:text-[#1D4ED8]">
                    {l.label}
                  </a>
                ))}
                <span className="ml-auto rounded bg-[#E8ECFF] px-2 py-1 font-semibold text-[#0F172A]">
                  $ BDT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}