import HeroSlideshow from "@/components/hero-slideshow";

export default function Home() {
  return (
    <>
      <HeroSlideshow />

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
