interface Tier {
  id: string;
  name: string;
  editionSize: number;
  price: number;
  includes: string[];
  badge?: string;
}

const tiers: Tier[] = [
  {
    id: "patron",
    name: "Patron",
    editionSize: 100,
    price: 150,
    includes: [
      "Digital lookbook — high resolution",
      "Printed lookbook, first edition",
      "Patron name in publication credits",
    ],
  },
  {
    id: "founder",
    name: "Founder Sweater",
    editionSize: 50,
    price: 300,
    includes: [
      "100% merino wool signature sweater",
      "Edition number embroidered at hem",
      "Certificate of Authenticity",
      "Printed lookbook, first edition",
    ],
    badge: "Most popular",
  },
  {
    id: "collector",
    name: "Collector Edition",
    editionSize: 25,
    price: 500,
    includes: [
      "Full capsule piece — style confirmed at close",
      "Numbered certificate of authenticity",
      "Name in the physical archive",
      "Printed lookbook, first edition",
      "Early access to future drops",
    ],
  },
  {
    id: "archive",
    name: "Archive",
    editionSize: 10,
    price: 1000,
    includes: [
      "One-hour bespoke consultation",
      "Hand-finished archive piece",
      "Platinum certificate of authenticity",
      "Permanent recognition in the LUMÍCHE archive",
      "Lifetime early access to all future editions",
    ],
    badge: "Limited",
  },
];

export default function Collection() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-28 px-8 text-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-ink/40 mb-5">
          Phase I — Kickstarter
        </p>
        <h2 className="font-serif text-5xl md:text-6xl italic font-light text-ink mb-6">
          The Collection
        </h2>
        <p className="text-sm font-light text-ink/50 max-w-sm mx-auto leading-relaxed">
          Each tier is a fixed edition. Once the campaign closes, these numbers never change.
        </p>
      </section>

      {/* Tier grid */}
      <section className="px-8 pb-36">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10">
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-bg px-10 py-12 flex flex-col gap-9 relative">
              {tier.badge && (
                <span className="absolute top-7 right-8 text-[10px] tracking-[0.2em] uppercase text-ink/35">
                  {tier.badge}
                </span>
              )}

              <div className="space-y-1.5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-ink/35">
                  1 / {tier.editionSize} Edition
                </p>
                <h3 className="font-serif text-2xl italic font-light text-ink leading-snug">
                  {tier.name}
                </h3>
              </div>

              <p className="font-serif text-[2.75rem] leading-none font-light text-ink">
                ${tier.price.toLocaleString()}
              </p>

              <ul className="flex-1 space-y-3">
                {tier.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-light text-ink/60 leading-snug">
                    <span className="mt-2 w-1 h-1 rounded-full bg-ink/30 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="https://kickstarter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center border border-ink/40 text-ink px-6 py-3.5 text-[11px] tracking-[0.22em] uppercase hover:bg-ink hover:text-bg hover:border-ink transition-colors duration-200 mt-2"
              >
                Back This Tier
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="pb-28 px-8">
        <div className="max-w-7xl mx-auto border-t border-ink/10 pt-12">
          <p className="text-[11px] tracking-[0.15em] uppercase text-ink/30 max-w-xl">
            All tiers include free worldwide shipping. Estimated delivery Q3 2025.
            Edition numbers assigned at time of fulfillment, in backer order.
          </p>
        </div>
      </section>
    </div>
  );
}
