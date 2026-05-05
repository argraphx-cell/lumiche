import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { label: "Collection", to: "/collection" },
  { label: "Authentication", to: "/authentication" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center">
        {/* Spacer to push wordmark to center */}
        <div className="flex-1" />

        {/* Centered wordmark */}
        <Link
          to="/"
          className="font-serif text-2xl italic tracking-widest text-ink hover:opacity-60 transition-opacity"
        >
          LUMÍCHE
        </Link>

        {/* Nav links — right side */}
        <nav className="flex-1 hidden md:flex justify-end items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[11px] tracking-[0.18em] uppercase transition-opacity ${
                pathname === link.to
                  ? "opacity-100 border-b border-ink pb-px"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <div className="flex-1 flex md:hidden justify-end">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[11px] tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg border-t border-ink/10 px-8 py-8">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-[11px] tracking-[0.2em] uppercase text-ink/70 hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
