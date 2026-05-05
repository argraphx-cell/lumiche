import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Hero — full viewport */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-8 pt-16 relative">
        <div className="space-y-10 max-w-4xl">
          <div className="space-y-4">
            <p className="text-[11px] tracking-[0.35em] uppercase text-ink/40">
              Pre-Launch — Now Live on Kickstarter
            </p>
            <h1 className="font-serif text-[14vw] sm:text-[11vw] md:text-[9rem] italic leading-none tracking-tight text-ink select-none">
              LUMÍCHE
            </h1>
            <p className="text-sm tracking-[0.3em] uppercase text-ink/50 font-light">
              Scarcity by design. Beauty by intention.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href="https://kickstarter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-ink text-ink px-12 py-4 text-[11px] tracking-[0.28em] uppercase hover:bg-ink hover:text-bg transition-colors duration-300"
            >
              Back This Project
            </a>
            <Link
              to="/collection"
              className="text-[11px] tracking-[0.2em] uppercase text-ink/50 hover:text-ink transition-colors"
            >
              View the Collection →
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-ink/20" />
        </div>
      </section>

      {/* Editorial pullquote */}
      <section className="py-36 px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <blockquote className="font-serif text-3xl md:text-4xl italic font-light leading-relaxed text-ink/75">
            "Each piece is made once,<br className="hidden md:block" /> for one person, with full intention."
          </blockquote>
          <div className="w-10 h-px bg-ink/20 mx-auto" />
          <p className="text-sm font-light leading-loose text-ink/50 max-w-md mx-auto">
            LUMÍCHE is a limited-edition fashion label built on the principles of radical scarcity
            and quiet luxury. No restocks. No excess. Only verified originals.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-8 border-t border-ink/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/10">
          {[
            { value: "185", label: "Total pieces — Phase I" },
            { value: "4", label: "Kickstarter tiers" },
            { value: "100%", label: "Certified originals" },
            { value: "0", label: "Restocks, ever" },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg px-10 py-12 text-center">
              <p className="font-serif text-5xl italic font-light text-ink mb-3">{stat.value}</p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-ink/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
