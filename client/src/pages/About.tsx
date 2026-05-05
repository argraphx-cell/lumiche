import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-28 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] tracking-[0.35em] uppercase text-ink/40 mb-6">The Brand</p>
          <h2 className="font-serif text-[12vw] sm:text-[9vw] md:text-[7rem] italic font-light text-ink leading-none">
            About
            <br />
            LUMÍCHE
          </h2>
        </div>
      </section>

      {/* Brand story */}
      <section className="px-8 pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start">
          {/* Pull quote */}
          <div className="md:col-span-5 md:sticky md:top-24">
            <blockquote className="font-serif text-2xl md:text-3xl italic font-light leading-relaxed text-ink/75">
              "Most fashion is made to be forgotten. We make things to be remembered."
            </blockquote>
          </div>

          {/* Body copy */}
          <div className="md:col-span-6 md:col-start-7 space-y-7 text-sm font-light text-ink/60 leading-loose">
            <p>
              LUMÍCHE began as a reaction to saturation. To the idea that more is more —
              more drops, more colorways, more noise. We started with one question:
              what would fashion look like if it were built the way fine art is?
              One run. Full documentation. No exceptions.
            </p>
            <p>
              Every piece we make is assigned an edition number before the first stitch
              is cut. We don't increase production based on demand. Scarcity is not a
              marketing tactic — it is a fundamental design constraint. It forces us to
              get each piece right, because there's no second chance.
            </p>
            <p>
              LUMÍCHE is currently in pre-launch. Our first capsule collection is
              funded through Kickstarter, and every backer becomes part of the permanent
              record of this label. This is Phase I.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-8 pb-36">
        <div className="max-w-6xl mx-auto border-t border-ink/10 pt-16">
          <p className="text-[11px] tracking-[0.3em] uppercase text-ink/35 mb-14">
            What we stand for
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: "Radical Scarcity",
                body: "Production limits are decided before design begins. The number never changes — not for sales, not for demand, not for anything.",
              },
              {
                title: "Full Provenance",
                body: "Every piece has a traceable origin: materials, maker, date of completion, edition number. No black boxes. No ambiguity.",
              },
              {
                title: "No Restocks",
                body: "Once a run closes, it is archived. We don't reissue. We don't restock. We move forward, and the record stands.",
              },
            ].map((value) => (
              <div key={value.title} className="space-y-4">
                <h4 className="text-[11px] tracking-[0.22em] uppercase text-ink">{value.title}</h4>
                <p className="text-sm font-light text-ink/55 leading-loose">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-28 text-center">
        <div className="max-w-md mx-auto space-y-8">
          <p className="text-sm font-light text-ink/50 leading-loose">
            Phase I is live now. Back the collection on Kickstarter before the edition closes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://kickstarter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-ink text-ink px-10 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-ink hover:text-bg transition-colors duration-300"
            >
              Back This Project
            </a>
            <Link
              to="/collection"
              className="text-[11px] tracking-[0.2em] uppercase text-ink/45 hover:text-ink transition-colors"
            >
              View tiers →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
