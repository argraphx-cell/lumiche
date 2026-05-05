export default function Authentication() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-28 px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.35em] uppercase text-ink/40 mb-6">
            LUMÍCHE Authentication
          </p>
          <h2 className="font-serif text-5xl md:text-[5.5rem] italic font-light text-ink leading-none max-w-3xl">
            Every piece is<br />provably real.
          </h2>
        </div>
      </section>

      {/* Explanation */}
      <section className="px-8 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32">
          <div className="space-y-7">
            <p className="font-light text-ink/60 leading-loose text-sm">
              Each LUMÍCHE piece is issued a unique Certificate of Authenticity at the time of
              fulfillment. The certificate carries a serial number tied to the edition, the
              maker's mark, and the date of completion — never reprinted, never reissued.
            </p>
            <p className="font-light text-ink/60 leading-loose text-sm">
              The Authentication Library allows anyone — buyers, collectors, institutions — to
              verify a piece's provenance using its certificate number. This system will be live
              at the time of first shipment.
            </p>
          </div>

          <div className="space-y-10">
            {[
              {
                number: "01",
                title: "Serial Certificate",
                body: "Each piece carries a numbered, signed physical certificate bound to its edition.",
              },
              {
                number: "02",
                title: "Digital Record",
                body: "Every certificate is registered in a permanent digital registry, immutable after issuance.",
              },
              {
                number: "03",
                title: "Verify Anytime",
                body: "Search by certificate number to confirm authenticity at any time, from anywhere.",
              },
            ].map((item) => (
              <div key={item.number} className="flex gap-7">
                <span className="font-serif text-lg italic text-ink/20 mt-0.5 flex-shrink-0">
                  {item.number}
                </span>
                <div className="space-y-1.5">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-ink">{item.title}</p>
                  <p className="text-sm font-light text-ink/55 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="px-8 pb-36">
        <div className="max-w-5xl mx-auto border-t border-ink/10 pt-16">
          <div className="space-y-6 max-w-xl">
            <p className="text-[11px] tracking-[0.22em] uppercase text-ink/40">
              Verify a certificate
            </p>
            <div className="flex items-stretch">
              <input
                type="text"
                placeholder="Certificate number — e.g. LMC-0042-F"
                disabled
                className="flex-1 bg-transparent border border-ink/20 px-5 py-4 text-sm font-light outline-none placeholder:text-ink/25 cursor-not-allowed"
              />
              <button
                disabled
                className="bg-ink/15 text-ink/35 px-7 py-4 text-[11px] tracking-[0.18em] uppercase cursor-not-allowed flex-shrink-0"
              >
                Search
              </button>
            </div>
            <p className="text-[11px] text-ink/25 tracking-[0.08em]">
              Authentication Library opens at first shipment — estimated Q3 2025.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
