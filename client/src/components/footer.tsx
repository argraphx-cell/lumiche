import { Link } from "react-router-dom";

const navLinks = [
  { label: "Collection", to: "/collection" },
  { label: "Authentication", to: "/authentication" },
  { label: "About", to: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          <Link
            to="/"
            className="font-serif text-xl italic tracking-widest text-ink hover:opacity-60 transition-opacity"
          >
            LUMÍCHE
          </Link>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] tracking-[0.18em] uppercase text-ink/40">
              Join the list
            </p>
            <div className="flex items-stretch">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-transparent border border-ink/25 px-4 py-3 text-sm font-light outline-none focus:border-ink transition-colors w-56 placeholder:text-ink/30"
              />
              <button
                type="button"
                className="bg-ink text-bg px-6 py-3 text-[11px] tracking-[0.18em] uppercase hover:opacity-75 transition-opacity"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-ink/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[11px] tracking-[0.12em] uppercase text-ink/30">
            © {new Date().getFullYear()} LUMÍCHE. All Rights Reserved.
          </p>
          <nav className="flex gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[11px] tracking-[0.12em] uppercase text-ink/30 hover:text-ink transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
